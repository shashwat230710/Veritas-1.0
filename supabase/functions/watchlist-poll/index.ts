// Deno Edge Function, triggered on a schedule via pg_cron.
// Phase 3 (see implementation plan §12) — not yet implemented.
//
// Planned shape: for each active watchlist, check ingested articles/updates
// since the last poll for anything matching `subject_ref`, summarize what
// changed via Claude, and insert a timeline_events row. Notification
// dispatch happens in the `notify` function, kept separate so polling
// frequency and notification batching can be tuned independently.

Deno.serve(async () => {
  return new Response(
    JSON.stringify({ status: "not implemented — Phase 3" }),
    { status: 501, headers: { "content-type": "application/json" } },
  );
});
