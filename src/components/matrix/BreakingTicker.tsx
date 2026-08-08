import React from "react";
import { BREAKING_TICKER_ITEMS } from "./mockData";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export const BreakingTicker: React.FC = () => {
  return (
    <div className="bg-[#04060a] border-b border-slate-800/80 overflow-hidden select-none py-2 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Ticker Badge */}
        <div className="flex items-center gap-2 bg-red-600/90 text-white font-extrabold text-[0.68rem] px-3 py-1 rounded-sm uppercase tracking-widest shrink-0 shadow-md">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span>REAL-TIME RADAR</span>
        </div>

        {/* Ticker Items (Horizontal Marquee) */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
          {BREAKING_TICKER_ITEMS.concat(BREAKING_TICKER_ITEMS).map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 font-bold">{item.code}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded text-[0.62rem] font-bold uppercase",
                  item.status === "VERIFIED"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                    : item.status === "NEEDS ATTENTION"
                    ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                    : "bg-red-950 text-red-400 border border-red-500/30"
                )}
              >
                {item.status}
              </span>
              <span className="hover:text-orange-400 transition-colors cursor-pointer">
                {item.text}
              </span>
              <span className="text-[0.65rem] text-slate-500">• {item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
