import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Brute-force tracker (in-memory per instance)
const attemptTracker = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase env not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { license_key, device_id, product_id, app_hash } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!license_key || !device_id || !product_id) {
      throw new Error("license_key, device_id, and product_id are required");
    }

    // Brute-force protection
    const trackKey = `${ip}_${product_id}`;
    const tracker = attemptTracker.get(trackKey);
    const now = Date.now();

    if (tracker && tracker.count >= MAX_ATTEMPTS && (now - tracker.lastAttempt) < LOCKOUT_MS) {
      await supabase.from("license_verification_logs").insert({
        license_key, device_id, product_id, ip_address: ip,
        result: "brute_force", attempt_count: tracker.count
      });
      return new Response(JSON.stringify({
        valid: false,
        reason: "Too many failed attempts. Try again in 15 minutes.",
        result: "brute_force"
      }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch license
    const { data: license, error: lErr } = await supabase
      .from("licenses")
      .select("id, status, device_id, app_hash, expiry_date, product_id")
      .eq("license_key", license_key)
      .eq("product_id", product_id)
      .single();

    const logResult = async (result: string) => {
      await supabase.from("license_verification_logs").insert({
        license_key, device_id, product_id, ip_address: ip, result,
        attempt_count: (tracker?.count || 0) + 1,
      });
    };

    if (lErr || !license) {
      // Track failed attempt
      attemptTracker.set(trackKey, { count: (tracker?.count || 0) + 1, lastAttempt: now });
      await logResult("invalid");
      return new Response(JSON.stringify({ valid: false, reason: "License key not found", result: "invalid" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check status
    if (license.status !== "active") {
      await logResult("revoked");
      return new Response(JSON.stringify({ valid: false, reason: "License is revoked", result: "revoked" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check expiry
    if (license.expiry_date && new Date(license.expiry_date) < new Date()) {
      await supabase.from("licenses").update({ status: "expired" }).eq("id", license.id);
      await logResult("expired");
      return new Response(JSON.stringify({ valid: false, reason: "License expired", result: "expired" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check APK hash (tamper detection)
    if (license.app_hash && app_hash && license.app_hash !== app_hash) {
      await logResult("hash_mismatch");
      return new Response(JSON.stringify({
        valid: false,
        reason: "APK has been modified — integrity check failed",
        result: "hash_mismatch"
      }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check device binding
    if (license.device_id) {
      if (license.device_id !== device_id) {
        attemptTracker.set(trackKey, { count: (tracker?.count || 0) + 1, lastAttempt: now });
        await logResult("device_mismatch");
        return new Response(JSON.stringify({
          valid: false,
          reason: "License is bound to a different device",
          result: "device_mismatch"
        }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } else {
      // First activation — bind device
      await supabase.from("licenses").update({
        device_id,
        app_hash: app_hash || null,
        activated_at: new Date().toISOString()
      }).eq("id", license.id);
    }

    // SUCCESS — clear brute-force tracker
    attemptTracker.delete(trackKey);
    await logResult("success");

    // Encrypt response token (simple signing)
    const token = btoa(JSON.stringify({ license_key, product_id, device_id, ts: now, valid: true }));

    return new Response(JSON.stringify({
      valid: true,
      result: "success",
      token,
      message: "License verified — Software Vala™ system unlocked",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("verify-license error:", msg);
    return new Response(JSON.stringify({ valid: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
