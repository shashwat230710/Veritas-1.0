// Deno Edge Function — Phase 3 (see implementation plan §12), not yet
// implemented.
//
// Planned shape: reads unread `notifications` rows, dispatches via
// Firebase Cloud Messaging (push) and/or SendGrid (email) per the user's
// notification preferences, then marks them dispatched. Triggered by a
// database webhook on `notifications` insert, or a short-interval
// pg_cron schedule — decide once Realtime vs. push tradeoffs are settled.

Deno.serve(async () => {
  return new Response(
    JSON.stringify({ status: "not implemented — Phase 3" }),
    { status: 501, headers: { "content-type": "application/json" } },
  );
});
