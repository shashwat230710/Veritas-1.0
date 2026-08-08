import React, { useState, useRef, useCallback } from "react";
import { Sliders, AlertTriangle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageCompareSliderProps {
  originalImage: string;
  verifiedImage: string;
  originalTitle?: string;
  verifiedTitle?: string;
  aiNotes?: string[];
}

export const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({
  originalImage,
  verifiedImage,
  originalTitle = "User Upload (Viral Photo)",
  verifiedTitle = "Reuters Official Wire / Maxar Satellite",
  aiNotes = [
    "Clone stamp tool detected at container stack coordinates [X: 54%, Y: 32%]",
    "Shadow vectors point to 14:00 UTC solar position despite 09:00 morning claims",
    "Inconsistent JPEG quantization matrices found across background grid"
  ]
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide">("slider");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPos(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6 bg-[#070b12] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl select-none"
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
            <Sliders className="h-4 w-4" />
            <span>Interactive Visual Comparison Matrix</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white pt-1">
            Side-by-Side Image Forensics Comparison Tool
          </h2>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode("slider")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer",
              viewMode === "slider" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white"
            )}
          >
            Split Drag Slider
          </button>
          <button
            onClick={() => setViewMode("sideBySide")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer",
              viewMode === "sideBySide" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white"
            )}
          >
            Dual View
          </button>
        </div>
      </div>

      {/* Split Slider Canvas Container */}
      {viewMode === "slider" && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 select-none cursor-ew-resize bg-slate-950 shadow-inner"
        >
          {/* Base Verified Image (Right) */}
          <img
            src={verifiedImage}
            alt={verifiedTitle}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Overlaid Original Image (Left - Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={originalImage}
              alt={originalTitle}
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: containerRef.current?.clientWidth || "100%" }}
            />
          </div>

          {/* Split Drag Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/50 cursor-grab active:cursor-grabbing border-2 border-white pointer-events-auto hover:scale-110 transition-transform"
            >
              <Sliders className="h-4 w-4" />
            </div>
          </div>

          {/* Labels Overlays */}
          <div className="absolute top-4 left-4 z-10 bg-red-950/90 text-red-300 border border-red-500/40 px-3 py-1 rounded-xl text-xs font-mono font-bold shadow-lg backdrop-blur-md">
            ⚠️ {originalTitle}
          </div>

          <div className="absolute top-4 right-4 z-10 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl text-xs font-mono font-bold shadow-lg backdrop-blur-md">
            ✓ {verifiedTitle}
          </div>
        </div>
      )}

      {/* Dual Side-by-Side View */}
      {viewMode === "sideBySide" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400">
              <span>⚠️ {originalTitle}</span>
              <span>SUSPECTED EDIT</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-red-500/40 aspect-video">
              <img src={originalImage} alt={originalTitle} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
              <span>✓ {verifiedTitle}</span>
              <span>100% C2PA VERIFIED</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-emerald-500/40 aspect-video">
              <img src={verifiedImage} alt={verifiedTitle} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* AI Difference Explanation Box */}
      <div className="bg-[#0b0f19] border border-orange-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>AI Difference & Tampering Explanation</span>
        </div>

        <div className="space-y-2">
          {aiNotes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
