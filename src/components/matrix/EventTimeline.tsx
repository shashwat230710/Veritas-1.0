import React from "react";
import { TimelineMilestone } from "./mockData";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
  timeline: TimelineMilestone[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6 bg-[#070b12] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
            <Clock className="h-4 w-4" />
            <span>Chronological Event Progression</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white pt-1">
            Verification Event Timeline & Forensic Trail
          </h2>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {timeline.map((item) => {
          const isVerified = item.status === "VERIFIED";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              {/* Timeline Bullet Node */}
              <div
                className={cn(
                  "absolute -left-6 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center bg-[#070b12]",
                  isVerified
                    ? "border-emerald-500 text-emerald-400"
                    : "border-orange-500 text-orange-400"
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isVerified ? "bg-emerald-500" : "bg-orange-500"
                  )}
                />
              </div>

              {/* Card Container */}
              <div className="bg-[#0b0f19] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 transition-all shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-orange-400 font-bold">{item.timestamp}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[0.65rem] font-mono font-bold border",
                      isVerified
                        ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-950 text-amber-400 border-amber-500/30"
                    )}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full sm:w-28 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                  )}

                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="text-[0.68rem] font-mono text-slate-400 pt-1">
                      Source: <span className="text-slate-200 font-bold">{item.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
