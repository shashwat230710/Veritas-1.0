import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Navbar } from "@/components/matrix/Navbar";
import { BreakingTicker } from "@/components/matrix/BreakingTicker";
import { HeroSection } from "@/components/matrix/HeroSection";
import { TruthScoreBadge } from "@/components/matrix/TruthScoreBadge";
import { ImageCompareSlider } from "@/components/matrix/ImageCompareSlider";
import { EvidenceGallery } from "@/components/matrix/EvidenceGallery";
import { EventTimeline } from "@/components/matrix/EventTimeline";
import { AIChatDrawer } from "@/components/matrix/AIChatDrawer";
import { VideoShowcase } from "@/components/matrix/VideoShowcase";
import { MOCK_CLAIMS, VerificationClaim, EvidenceImage } from "@/components/matrix/mockData";
import { Sparkles, Send, Sliders, Activity, Clock, FileText, Layers, CheckCircle2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: TruthMatrixApp,
});

function TruthMatrixApp() {
  const [activeCategory, setActiveCategory] = useState("HOME");
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<"article" | "compare" | "timeline" | "stream">("compare");
  const [chatOpen, setChatOpen] = useState(false);

  // Custom claim text input for automated entity extraction & image matching simulation
  const [customArticleText, setCustomArticleText] = useState("");
  const [isProcessingInput, setIsProcessingInput] = useState(false);

  // Filter claims dynamically by selected category
  const filteredClaims = useMemo(() => {
    if (activeCategory === "HOME" || activeCategory === "ALL" || !activeCategory) {
      return MOCK_CLAIMS;
    }
    const catUpper = activeCategory.toUpperCase();
    const matches = MOCK_CLAIMS.filter((c) => c.category === catUpper || (catUpper === "TECHNOLOGY" && c.category === "TECH"));
    return matches.length > 0 ? matches : MOCK_CLAIMS;
  }, [activeCategory]);

  // Active claim selection
  const activeClaim: VerificationClaim = useMemo(() => {
    if (selectedClaimId) {
      const found = MOCK_CLAIMS.find((c) => c.id === selectedClaimId);
      if (found) return found;
    }
    return filteredClaims[0] || MOCK_CLAIMS[0];
  }, [selectedClaimId, filteredClaims]);

  // Smooth scroll target handler
  const scrollToCompare = () => {
    setActiveMainTab("compare");
    const el = document.getElementById("compare-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectCompareFromGallery = (ev: EvidenceImage) => {
    scrollToCompare();
  };

  // Simulate text processing & entity extraction on submit
  const handleAnalyzeText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customArticleText.trim()) return;

    setIsProcessingInput(true);
    setTimeout(() => {
      setIsProcessingInput(false);
      setChatOpen(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-orange-500 selection:text-white pb-24">
      {/* 1. EDITORIAL NAVBAR (Exact Daily News Reference Image Match) */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedClaimId(null);
        }}
        onOpenSearch={() => setChatOpen(true)}
        onOpenChatDrawer={() => setChatOpen(true)}
      />

      {/* 2. REAL-TIME BREAKING TICKER MARQUEE */}
      <BreakingTicker />

      {/* 3. HERO FEATURED STORY & BREAKING NEWS SIDEBAR */}
      <HeroSection
        activeClaim={activeClaim}
        allClaims={filteredClaims}
        onSelectClaim={(claim) => setSelectedClaimId(claim.id)}
        onOpenCompare={scrollToCompare}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        {/* 4. REAL-TIME TEXT PROCESSING & AUTOMATED ENTITY EXTRACTION BAR */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#0a0e17] via-[#0d1424] to-[#0a0e17] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>REAL-TIME MULTI-SOURCE EVALUATION & ENTITY EXTRACTION ENGINE</span>
          </div>

          <form onSubmit={handleAnalyzeText} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={customArticleText}
                onChange={(e) => setCustomArticleText(e.target.value)}
                placeholder="Paste news claim, article text, or satellite image URL to evaluate across Reuters, AP & Maxar..."
                className="w-full bg-[#060911] border border-slate-700/80 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessingInput}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isProcessingInput ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Evaluating News Sources...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Evaluate Across Wire Sources</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Queries */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
            <span className="font-mono text-[0.68rem] text-slate-500">Suggested Evaluations:</span>
            {activeClaim.aiPromptMatches.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomArticleText(prompt);
                  setChatOpen(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[0.68rem] font-mono px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </motion.section>

        {/* 5. INTERACTIVE FEATURE TABS SWITCHER */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "compare", label: "Evidence Gallery & Compare Tool", icon: Sliders },
            { id: "stream", label: "Live Video Stream Forensics", icon: Activity },
            { id: "timeline", label: "Event Progression Timeline", icon: Clock },
            { id: "article", label: "Full Theoretical Masterclass", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 6. TAB CONTENT PANELS WITH SMOOTH FADE ANIMATION */}
        <AnimatePresence mode="wait">
          {activeMainTab === "compare" && (
            <motion.div
              key={`tab-compare-${activeClaim.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* TRUTH CONFIDENCE GAUGE */}
              <TruthScoreBadge
                score={activeClaim.truthScore}
                status={activeClaim.status}
                biasRating={activeClaim.biasRating}
                spectralScore={activeClaim.spectralConsistency}
                exifScore={activeClaim.exifIntegrity}
                variant="full"
              />

              {/* SIDE-BY-SIDE DRAG COMPARISON SLIDER */}
              <div id="compare-section">
                <ImageCompareSlider
                  originalImage={activeClaim.comparedOriginalImage}
                  verifiedImage={activeClaim.comparedVerifiedImage}
                  originalTitle={`${activeClaim.title} (Suspected Edit)`}
                  verifiedTitle="Reuters Wire / Maxar Orbital Satellite Pass"
                  aiNotes={[
                    "Cross-matching multi-spectral satellite imagery against global news wires",
                    "Telemetry analysis verifies sensor timestamp and solar elevation angles",
                    activeClaim.aiAnalysisSummary
                  ]}
                />
              </div>

              {/* EVIDENCE GALLERY GRID */}
              <EvidenceGallery
                evidenceList={activeClaim.evidenceList}
                onSelectCompare={handleSelectCompareFromGallery}
              />
            </motion.div>
          )}

          {activeMainTab === "stream" && (
            <motion.div
              key="tab-stream"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <VideoShowcase />
            </motion.div>
          )}

          {activeMainTab === "timeline" && (
            <motion.div
              key={`tab-timeline-${activeClaim.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <EventTimeline timeline={activeClaim.timeline} />
            </motion.div>
          )}

          {activeMainTab === "article" && (
            <motion.div
              key={`tab-article-${activeClaim.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#070b12] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-slate-300 leading-relaxed font-sans"
            >
              <h2 className="font-serif text-3xl font-bold text-white">
                {activeClaim.headlineSerif}
              </h2>
              <p className="text-base text-slate-200">
                {activeClaim.summary}
              </p>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-orange-400">
                AI Forensics Summary: {activeClaim.aiAnalysisSummary}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 7. DOCKED / FLOATING TRUTH AI ASSISTANT DRAWER */}
      <AIChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
