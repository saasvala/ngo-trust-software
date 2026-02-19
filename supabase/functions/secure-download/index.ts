import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase env not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { product_id, license_key } = await req.json();
    if (!product_id) throw new Error("product_id is required");

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

    // Fetch product
    const { data: product, error: pErr } = await supabase
      .from("products")
      .select("id, name, storage_path, apk_url, app_hash, require_payment, license_enabled, status, secure_download")
      .eq("id", product_id)
      .single();

    if (pErr || !product) throw new Error("Product not found");
    if (product.status !== "active") throw new Error("Product is not active");

    // Check storage path exists
    if (!product.storage_path) {
      await supabase.from("download_logs").insert({ product_id, status: "blocked", ip_address: ip, user_agent: req.headers.get("user-agent") });
      throw new Error("APK file not found in storage — download blocked");
    }

    // If payment required, check license
    if (product.require_payment) {
      if (!license_key) {
        await supabase.from("download_logs").insert({ product_id, status: "blocked", ip_address: ip });
        throw new Error("Payment and license key required before download");
      }
      const { data: license } = await supabase
        .from("licenses")
        .select("id, status, app_hash")
        .eq("license_key", license_key)
        .eq("product_id", product_id)
        .single();

      if (!license || license.status !== "active") {
        throw new Error("Invalid or revoked license key");
      }
    }

    // Verify storage file still exists
    const { data: fileData, error: fileErr } = await supabase.storage
      .from("apk-storage")
      .list(product.storage_path.split("/").slice(0, -1).join("/") || "apks");

    const fileName = product.storage_path.split("/").pop();
    const fileExists = !fileErr && fileData?.some((f: { name: string }) => f.name === fileName);

    if (!fileExists) {
      // Auto-disable product if storage file deleted
      await supabase.from("products").update({ status: "draft" }).eq("id", product_id);
      await supabase.from("download_logs").insert({ product_id, status: "blocked", ip_address: ip });
      throw new Error("Storage file not found — product auto-disabled");
    }

    // Generate signed URL (5 minutes = 300 seconds)
    const { data: signedData, error: signErr } = await supabase.storage
      .from("apk-storage")
      .createSignedUrl(product.storage_path, 300);

    if (signErr || !signedData?.signedUrl) throw new Error("Failed to generate signed download URL");

    // Log successful download
    await supabase.from("download_logs").insert({
      product_id,
      license_key: license_key || null,
      ip_address: ip,
      user_agent: req.headers.get("user-agent"),
      status: "success",
    });

    return new Response(JSON.stringify({
      signed_url: signedData.signedUrl,
      expires_in: 300,
      app_hash: product.app_hash,
      product_name: product.name,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("secure-download error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
