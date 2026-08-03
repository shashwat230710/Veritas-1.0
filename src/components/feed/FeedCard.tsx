import { useState } from "react";
import type { FeedItem } from "@/lib/database.types";
import { VerdictChip } from "./VerdictChip";
import { TruthMeter } from "./TruthMeter";
import { KeepAnEyeButton } from "./KeepAnEyeButton";
import { ArticleDetailModal } from "./ArticleDetailModal";
import { ChevronRight, Layers } from "lucide-react";

export function FeedCard({
  item,
  userId,
  variant = "standard",
  onOpenDetail,
}: {
  item: FeedItem;
  userId: string | undefined;
  variant?: "standard" | "trending";
  onOpenDetail?: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const categoryTag = (item.category ?? "Tech").toUpperCase();

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail();
    } else {
      setInternalOpen(true);
    }
  };

  return (
    <>
      {variant === "trending" ? (
        /* Featured Trending Visual Card (Inspired by Screen 2 in Reference Image) */
        <article
          onClick={handleCardClick}
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#161c2b] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer"
        >
          {/* Top Visual Image Banner */}
          <div className="h-44 sm:h-48 w-full relative overflow-hidden bg-slate-900">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#161c2b] via-black/20 to-black/40" />
            
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
              <span className="rounded-md bg-orange-500 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-md">
                {categoryTag}
              </span>
              <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[0.65rem] font-mono text-white/90 border border-white/10 flex items-center gap-1">
                <Layers className="h-3 w-3 text-orange-400" /> 4 Sources
              </span>
            </div>
          </div>

          {/* Card Content Body */}
          <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
            <h3 className="font-sans text-base font-bold leading-snug text-white group-hover:text-orange-400 transition-colors line-clamp-2">
              {item.title}
            </h3>

            {item.summary && (
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                {item.summary}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
              <TruthMeter score={item.truthScore ?? 88} verdict={item.verdict ?? "true"} />

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <KeepAnEyeButton
                  userId={userId}
                  subjectRef={item.id}
                  title={item.title}
                  category={item.category}
                  summary={item.summary}
                  truthScore={item.truthScore}
                  verdict={item.verdict}
                  isWatched={item.isWatched}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  aria-label="View story details"
                  className="p-1.5 rounded-full text-slate-400 hover:text-orange-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        /* Standard Visual Story Card (Inspired by Screen 2 Today's Read) */
        <article
          onClick={handleCardClick}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#161c2b] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer"
        >
          {item.imageUrl && (
            <div className="h-36 sm:h-40 w-full relative overflow-hidden bg-slate-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161c2b] via-transparent to-black/30" />
            </div>
          )}

          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-orange-400">
                  {categoryTag}
                </span>
                {item.verdict && <VerdictChip verdict={item.verdict} />}
              </div>

              <h3 className="font-sans text-base font-bold leading-snug text-white group-hover:text-orange-400 transition-colors">
                {item.title}
              </h3>

              {item.summary && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <TruthMeter score={item.truthScore ?? 88} verdict={item.verdict ?? "true"} />

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <KeepAnEyeButton
                  userId={userId}
                  subjectRef={item.id}
                  title={item.title}
                  category={item.category}
                  summary={item.summary}
                  truthScore={item.truthScore}
                  verdict={item.verdict}
                  isWatched={item.isWatched}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  aria-label="View story details"
                  className="p-1.5 rounded-full text-slate-400 hover:text-orange-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      )}

      {internalOpen && !onOpenDetail && (
        <ArticleDetailModal
          item={item}
          userId={userId}
          onClose={() => setInternalOpen(false)}
        />
      )}
    </>
  );
}
