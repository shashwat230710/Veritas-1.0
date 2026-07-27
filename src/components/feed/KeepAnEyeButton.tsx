import { Eye } from "lucide-react";
import { useKeepAnEye } from "@/lib/queries/useKeepAnEye";
import { cn } from "@/lib/utils";

export function KeepAnEyeButton({
  userId,
  subjectRef,
  isWatched = false,
}: {
  userId: string | undefined;
  subjectRef: string;
  isWatched?: boolean;
}) {
  const { mutate, isPending } = useKeepAnEye();

  return (
    <button
      type="button"
      disabled={!userId || isPending || isWatched}
      onClick={() => userId && mutate({ userId, subjectRef })}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors",
        isWatched
          ? "bg-primary/15 text-primary border-primary/40"
          : "text-muted-foreground hover:text-foreground hover:border-ring",
      )}
    >
      <Eye className="h-3.5 w-3.5" />
      {isWatched ? "Watching" : "Keep an Eye"}
    </button>
  );
}
