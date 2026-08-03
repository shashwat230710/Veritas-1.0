// Deno Edge Function: POST /functions/v1/chat
// Body: { messages: {role: "user"|"assistant", content: string}[], memeMode?: boolean }

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildSystemPrompt(memeMode: boolean): string {
  const base = `You are the Veritas Global News Assistant — a multi-source news evaluator and global search engine.
You analyze, fact-check, and re-evaluate any type of news claim, headline, rumor, or current event from anywhere in the world.
When answering:
1. Re-evaluate the accuracy, context, and ground truth of the news claim.
2. Provide a clear truth verdict (True, Mixed, False, or Needs Verification) with estimated truth score.
3. Cite reliable news sources, official wire reports, or peer-reviewed documentation.
4. Separate verified facts from opinion or viral hype.
5. If the query is complex, offer deeper background breakdown.`;

  if (!memeMode) return base;

  return `${base}

Meme Mode is ON: keep a light, witty, internet-native tone. This changes DELIVERY ONLY —
never soften a hedge, never round a confidence level up, and never drop a caveat for the
sake of a joke. Accuracy always wins over the bit.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, memeMode } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Missing `messages`" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured on edge server" }),
        { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1400,
        system: buildSystemPrompt(Boolean(memeMode)),
        messages,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Claude API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const reply = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n\n")
      .trim();

    return new Response(
      JSON.stringify({
        reply: reply || "I wasn't able to put together an answer for that — try rephrasing?",
      }),
      {
        headers: { ...corsHeaders, "content-type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Chat edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
    );
  }
});

