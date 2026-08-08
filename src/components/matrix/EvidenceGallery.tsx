import React, { useState } from "react";
import { EvidenceImage } from "./mockData";
import { ShieldCheck, MapPin, Calendar, Layers, Eye, Maximize2, AlertTriangle, CheckCircle, FileCode, Sliders, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EvidenceGalleryProps {
  evidenceList: EvidenceImage[];
  onSelectCompare: (ev: EvidenceImage) => void;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  evidenceList,
  onSelectCompare,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [activeLightboxImage, setActiveLightboxImage] = useState<EvidenceImage | null>(null);

  const filters = [
    { label: "ALL", filterKey: "ALL" },
    { label: "WIRES (REUTERS/AP)", filterKey: "Wire" },
    { label: "SATELLITE PASS", filterKey: "Satellite" },
    { label: "GOV ARCHIVES", filterKey: "Government Archive" },
    { label: "USER UPLOADS", filterKey: "User Upload" },
  ];

  const filteredItems = evidenceList.filter((item) => {
    if (selectedFilter === "ALL") return true;
    return item.metadata.sourceType === selectedFilter;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="space-y-6 bg-[#070b12] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl"
    >
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Automated Multi-Source Matching Engine</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white pt-1">
            Multi-Source Visual Evidence Gallery
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.filterKey}
              onClick={() => setSelectedFilter(f.filterKey)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-mono text-[0.68rem] font-bold transition-all whitespace-nowrap cursor-pointer",
                selectedFilter === f.filterKey
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Evidence Cards with Framer Motion Layout Animation */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => {
            const isHighTrust = item.metadata.reliabilityScore >= 90;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group bg-[#0b0f19] border border-slate-800/90 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Image Preview & Badges */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Source Badge Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[0.65rem] font-mono font-bold tracking-wide shadow-md backdrop-blur-md border",
                        isHighTrust
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-950/90 text-amber-300 border-amber-500/40"
                      )}
                    >
                      {item.metadata.sourceName} • {item.metadata.reliabilityScore}% TRUST
                    </span>
                  </div>

                  {/* Expand / Lightbox Opener */}
                  <button
                    onClick={() => setActiveLightboxImage(item)}
                    className="absolute bottom-3 right-3 p-2 bg-slate-950/80 hover:bg-orange-500 text-white rounded-xl backdrop-blur-md border border-slate-700/80 transition-colors shadow-lg cursor-pointer"
                    title="Inspect High-Res & EXIF"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Metadata Row */}
                    <div className="space-y-1.5 pt-2 text-[0.68rem] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span>{item.metadata.captureDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="h-3 w-3 text-orange-400 shrink-0" />
                        <span>{item.metadata.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deepfake & EXIF Pills */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[0.65rem] font-mono">
                      <span className="text-slate-400">Deepfake Noise:</span>
                      <span
                        className={cn(
                          "font-bold",
                          item.metadata.deepfakeScore < 0.2 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {(item.metadata.deepfakeScore * 100).toFixed(1)}% AI Noise
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelectCompare(item)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-orange-500/50"
                    >
                      <Sliders className="h-3.5 w-3.5 text-orange-400" />
                      <span>Compare Side-by-Side</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox / High-Res EXIF Inspector Modal */}
      <AnimatePresence>
        {activeLightboxImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#090d16] border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-900/80 text-slate-400 hover:text-white rounded-full border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Image View */}
              <div className="lg:w-7/12 bg-black p-4 flex items-center justify-center relative min-h-[320px]">
                <img
                  src={activeLightboxImage.highResUrl}
                  alt={activeLightboxImage.title}
                  className="max-h-[75vh] w-auto object-contain rounded-xl"
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-emerald-400 border border-emerald-500/30">
                  ✓ Cryptographic C2PA Authenticated
                </div>
              </div>

              {/* Right EXIF & Forensic Metadata Panel */}
              <div className="lg:w-5/12 p-6 overflow-y-auto space-y-5 text-slate-300 text-xs">
                <div>
                  <span className="text-[0.65rem] font-mono text-orange-400 uppercase font-bold">
                    {activeLightboxImage.metadata.sourceType} EVIDENCE
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white pt-1">
                    {activeLightboxImage.title}
                  </h3>
                </div>

                {/* Source & Reliability Score */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-white">{activeLightboxImage.metadata.sourceName}</span>
                    <span className="text-emerald-400 font-bold">
                      {activeLightboxImage.metadata.reliabilityScore}% Trust
                    </span>
                  </div>
                  <p className="text-[0.68rem] text-slate-400">
                    {activeLightboxImage.metadata.location} • {activeLightboxImage.metadata.captureDate}
                  </p>
                </div>

                {/* EXIF Parameters if available */}
                {activeLightboxImage.metadata.exifDetails && (
                  <div className="space-y-2">
                    <h4 className="font-mono text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                      <FileCode className="h-4 w-4 text-orange-400" />
                      Camera EXIF Parameters
                    </h4>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[0.68rem] bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <div><span className="text-slate-500">Camera:</span> <span className="text-slate-200">{activeLightboxImage.metadata.exifDetails.camera}</span></div>
                      <div><span className="text-slate-500">Lens:</span> <span className="text-slate-200">{activeLightboxImage.metadata.exifDetails.lens}</span></div>
                      <div><span className="text-slate-500">Focal Length:</span> <span className="text-slate-200">{activeLightboxImage.metadata.exifDetails.focalLength}</span></div>
                      <div><span className="text-slate-500">ISO:</span> <span className="text-slate-200">{activeLightboxImage.metadata.exifDetails.iso}</span></div>
                      <div><span className="text-slate-500">Shutter:</span> <span className="text-slate-200">{activeLightboxImage.metadata.exifDetails.shutter}</span></div>
                      <div><span className="text-slate-500">Aperture:</span> <span className="text-slate-200">{activeLightboxImage.metadata.exifDetails.aperture}</span></div>
                    </div>
                  </div>
                )}

                {/* Forensic Highlights */}
                {activeLightboxImage.metadata.forensicHighlights && (
                  <div className="space-y-2">
                    <h4 className="font-mono text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      AI Forensic Highlights
                    </h4>
                    <ul className="space-y-1.5 text-[0.68rem]">
                      {activeLightboxImage.metadata.forensicHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
