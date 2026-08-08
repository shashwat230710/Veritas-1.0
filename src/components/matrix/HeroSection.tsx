import React from "react";
import { VerificationClaim } from "./mockData";
import { TruthScoreBadge } from "./TruthScoreBadge";
import { Flame, Radio, Clock, ShieldCheck, Tag, ArrowRight, Sparkles, TrendingUp, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  activeClaim: VerificationClaim;
  allClaims: VerificationClaim[];
  onSelectClaim: (claim: VerificationClaim) => void;
  onOpenCompare: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeClaim,
  allClaims,
  onSelectClaim,
  onOpenCompare,
  onOpenChat,
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Main Featured Editorial Story Card (8 Columns) - Exact Reference Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-slate-800/90 bg-[#070b12] p-6 sm:p-10 flex flex-col justify-between shadow-2xl group min-h-[500px]"
        >
          {/* Background Image with Dark Gradient Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={activeClaim.primaryHeroImage}
              alt={activeClaim.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 opacity-40 contrast-125 brightness-75"
            />
            {/* Multi-stage Gradient Overlay for strict editorial legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
          </div>

          {/* Top Badges & Live Status */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#EF4444] text-white font-extrabold text-[0.68rem] tracking-widest px-3 py-1 uppercase rounded-sm shadow-md shadow-red-500/20">
                HOT NOW
              </span>
              <span className="bg-slate-900/90 border border-slate-700/80 text-orange-400 text-xs font-mono font-bold px-3 py-1 rounded-md">
                {activeClaim.category}
              </span>
            </div>

            {/* Compact Truth Score Gauge Badge */}
            <TruthScoreBadge
              score={activeClaim.truthScore}
              status={activeClaim.status}
              spectralScore={activeClaim.spectralConsistency}
              exifScore={activeClaim.exifIntegrity}
              variant="compact"
            />
          </div>

          {/* Middle/Bottom Story Headline & Summary */}
          <div className="relative z-10 space-y-4 max-w-3xl pt-12">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl">
              {activeClaim.headlineSerif}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed font-sans font-normal">
              {activeClaim.summary}
            </p>

            {/* Extracted Key Entities Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[0.68rem] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                <Tag className="h-3 w-3 text-orange-400" />
                <span>Extracted Entities:</span>
              </span>
              {activeClaim.entities.map((ent) => (
                <span
                  key={ent.name}
                  className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-mono px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title={`Confidence: ${(ent.confidence * 100).toFixed(0)}%`}
                >
                  <span className="text-[0.65rem] text-orange-400 font-bold">[{ent.type}]</span>
                  <span>{ent.name}</span>
                </span>
              ))}
            </div>

            {/* Bottom Indicator & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase font-bold">
                <TrendingUp className="h-4 w-4 text-red-500 animate-bounce" />
                <span>TRENDING NOW</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenCompare}
                  className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Compare Image Evidence</span>
                </button>

                <button
                  onClick={onOpenChat}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-orange-400" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side-Rail: Breaking News Claims List (4 Columns) - Exact Reference Match */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-4 bg-[#070b12] rounded-3xl border border-slate-800/90 p-5 flex flex-col justify-between space-y-4 shadow-xl"
        >
          {/* Header matching exact reference */}
          <div className="flex items-center gap-2 text-slate-200 font-serif font-bold text-base border-b border-slate-800 pb-3">
            <Megaphone className="h-4 w-4 text-[#EF4444]" />
            <span className="uppercase tracking-wide text-xs font-mono font-extrabold text-[#EF4444]">
              BREAKING NEWS
            </span>
          </div>

          {/* List of Claims with Square Thumbnails & Timestamps */}
          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[440px] pr-1">
            {allClaims.map((claim) => (
              <motion.div
                key={claim.id}
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => onSelectClaim(claim)}
                className={cn(
                  "p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group",
                  activeClaim.id === claim.id
                    ? "bg-orange-500/10 border-orange-500/50 shadow-md shadow-orange-500/10"
                    : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                )}
              >
                <img
                  src={claim.primaryHeroImage}
                  alt={claim.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800 group-hover:border-orange-500/50 transition-all"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-serif text-xs font-bold text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                    {claim.headlineSerif}
                  </h3>
                  <div className="flex items-center justify-between text-[0.65rem] font-mono text-slate-400 pt-0.5">
                    <span className="text-orange-400 font-bold uppercase">{claim.category}</span>
                    <span className="text-slate-500 uppercase">{claim.publishedAt}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Card CTA */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs">C2PA Cryptographic Wire</p>
              <p className="text-[0.68rem] text-slate-400 font-mono">100% Verified Multi-Satellite Passes</p>
            </div>
            <ArrowRight className="h-4 w-4 text-orange-400 shrink-0" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
