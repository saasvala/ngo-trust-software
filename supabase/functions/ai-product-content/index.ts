import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, category, version, techStack, useCase } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are a SaaS product content writer for Software Vala™, an Indian software marketplace.

Generate professional product content for:
Product Name: ${name}
Category: ${category || "Software"}
Version: ${version || "1.0.0"}
Tech Stack: ${(techStack || []).join(", ") || "Not specified"}
Use Case: ${useCase || "Business automation"}

Return a JSON object with EXACTLY these fields:
{
  "shortDesc": "One-line pitch under 100 characters",
  "description": "3-4 paragraph detailed description, professional tone, mention Software Vala™",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "seoTitle": "SEO title under 60 chars with main keyword",
  "seoDescription": "Meta description under 160 chars",
  "tags": ["#tag1", "#tag2", "#tag3", "#tag4"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "useCase": "Detailed use case paragraph"
}

Return ONLY valid JSON. No markdown, no explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI gateway error [${response.status}]: ${err}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    // Clean and parse JSON
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("ai-product-content error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
