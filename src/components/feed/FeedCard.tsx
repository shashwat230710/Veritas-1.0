import type { FeedItem } from "@/lib/database.types";
import { VerdictChip } from "./VerdictChip";
import { TruthMeter } from "./TruthMeter";
import { KeepAnEyeButton } from "./KeepAnEyeButton";

export function FeedCard({
  item,
  userId,
}: {
  item: FeedItem;
  userId: string | undefined;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {item.category ?? "General"}
        </span>
        {item.verdict && <VerdictChip verdict={item.verdict} />}
      </div>

      <h3 className="font-serif text-xl leading-snug">{item.title}</h3>

      {item.summary && (
        <p className="text-sm text-muted-foreground">{item.summary}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        {item.truthScore != null && item.verdict ? (
          <TruthMeter score={item.truthScore} verdict={item.verdict} />
        ) : (
          <span className="text-xs text-muted-foreground">Not yet analyzed</span>
        )}
        <KeepAnEyeButton
          userId={userId}
          subjectRef={item.id}
          isWatched={item.isWatched}
        />
      </div>
    </article>
  );
}
