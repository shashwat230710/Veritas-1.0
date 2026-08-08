import React, { useState } from "react";
import { Play, Pause, ShieldCheck, Activity, Eye, Volume2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const VideoShowcase: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "audio" | "spectrum">("video");

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none"
    >
      <div className="bg-gradient-to-br from-[#0a0e17] via-[#090d16] to-[#0a0e17] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-orange-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              <Activity className="h-4 w-4" />
              <span>Real-Time Deepfake & Video Forensics Engine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white pt-1">
              Live Video Stream & Deepfake Forensics Inspector
            </h2>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("video")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer",
                activeTab === "video" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white"
              )}
            >
              Video Stream
            </button>
            <button
              onClick={() => setActiveTab("audio")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer",
                activeTab === "audio" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white"
              )}
            >
              Voice Spectrum
            </button>
          </div>
        </div>

        {/* Main Video Screen Container */}
        <div className="relative aspect-video max-h-[500px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group flex items-center justify-center">
          {/* Simulated Video Canvas Frame */}
          <img
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80"
            alt="Port Video Feed Forensics"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Real-time AI Bounding Box Overlays */}
          <div className="absolute top-1/4 left-1/3 w-36 h-36 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none animate-pulse flex items-start justify-start p-1.5">
            <span className="bg-emerald-950/90 text-emerald-400 text-[0.62rem] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/40">
              Container Stack • 99.8% Genuine
            </span>
          </div>

          <div className="absolute top-1/2 right-1/4 w-32 h-32 border-2 border-dashed border-red-500/80 rounded-xl pointer-events-none animate-pulse flex items-start justify-start p-1.5">
            <span className="bg-red-950/90 text-red-300 text-[0.62rem] font-mono font-bold px-1.5 py-0.5 rounded border border-red-500/40">
              AI Noise Detected (78%)
            </span>
          </div>

          {/* Play/Pause Center Button Overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute p-5 bg-orange-500/90 hover:bg-orange-400 text-white rounded-full backdrop-blur-md shadow-2xl transition-transform transform group-hover:scale-110 cursor-pointer border-2 border-white/20"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </button>

          {/* Top Status Pill */}
          <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>STREAM VERIFIED • 60 FPS • C2PA ENCRYPTED</span>
          </div>
        </div>

        {/* Sub-Metrics Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <span className="text-slate-400">Frame Consistency:</span>
            <span className="text-emerald-400 font-bold">99.4% Pass</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <span className="text-slate-400">Lip-Sync Biometric Match:</span>
            <span className="text-emerald-400 font-bold">100.0% Aligned</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <span className="text-slate-400">Temporal Flicker Noise:</span>
            <span className="text-orange-400 font-bold">0.02% (Nominal)</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
