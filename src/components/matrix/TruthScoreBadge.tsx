import React from "react";
import { ShieldCheck, AlertTriangle, XCircle, Info, Activity, Scale, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TruthScoreBadgeProps {
  score: number; // 0 - 100
  status: "VERIFIED" | "NEEDS ATTENTION" | "MANIPULATED";
  biasRating?: string;
  spectralScore?: number;
  exifScore?: number;
  variant?: "full" | "compact";
}

export const TruthScoreBadge: React.FC<TruthScoreBadgeProps> = ({
  score,
  status,
  biasRating = "Independent Fact Check",
  spectralScore = 98.2,
  exifScore = 99.4,
  variant = "full",
}) => {
  const isHighConfidence = score >= 85;
  const isMediumConfidence = score >= 50 && score < 85;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 border px-3 py-1.5 rounded-xl font-mono backdrop-blur-md shadow-lg",
          isHighConfidence && "bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10",
          isMediumConfidence && "bg-amber-950/80 border-amber-500/50 text-amber-400 shadow-amber-500/10",
          !isHighConfidence && !isMediumConfidence && "bg-red-950/80 border-red-500/50 text-red-400 shadow-red-500/10"
        )}
      >
        {isHighConfidence ? (
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        ) : isMediumConfidence ? (
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 text-red-400 shrink-0" />
        )}
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span>{score}% CONFIDENCE</span>
          <span className="text-[0.65rem] opacity-75">• {status}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="bg-[#080c15] border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
    >
      {/* Header & Score Circle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <Activity className="h-4 w-4 text-orange-400" />
            <span>AI TRUTH CONFIDENCE GAUGE</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white pt-1">
            Automated Fact Verification & Forensics Index
          </h3>
        </div>

        {/* Circular / Badge Display */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border min-w-[120px] text-center shadow-inner",
              isHighConfidence && "bg-emerald-950/60 border-emerald-500/40 text-emerald-400",
              isMediumConfidence && "bg-amber-950/60 border-amber-500/40 text-amber-400",
              !isHighConfidence && !isMediumConfidence && "bg-red-950/60 border-red-500/40 text-red-400"
            )}
          >
            <span className="font-mono text-3xl font-black leading-none">{score}%</span>
            <span className="text-[0.68rem] font-bold tracking-wider uppercase pt-1.5">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Metrics Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Metric 1: EXIF Metadata Integrity */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
              EXIF & Telemetry Integrity
            </span>
            <span className="text-cyan-400 font-bold">{exifScore}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${exifScore}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            />
          </div>
          <p className="text-[0.68rem] text-slate-400 font-mono">
            Camera serial #, GPS telemetry & sensor noise match
          </p>
        </div>

        {/* Metric 2: Spectral & Shadow Consistency */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-orange-400" />
              Spectral & Lighting Analysis
            </span>
            <span className="text-orange-400 font-bold">{spectralScore}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${spectralScore}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
            />
          </div>
          <p className="text-[0.68rem] text-slate-400 font-mono">
            Solar elevation angle matches shadow projection vectors
          </p>
        </div>
      </div>

      {/* Bias Rating & Fact Check Rating Bar */}
      <div className="bg-[#05080e] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Scale className="h-4 w-4 text-orange-400 shrink-0" />
          <span><strong>Media Bias & Source Rating:</strong> {biasRating}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[0.68rem] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg">
          <Info className="h-3.5 w-3.5" />
          <span>C2PA Standard Certified</span>
        </div>
      </div>
    </motion.div>
  );
};
