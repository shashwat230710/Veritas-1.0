import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRunQuery?: (query: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  citations?: string[];
  confidence?: number;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  onRunQuery,
}) => {
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Greetings. I am Veritas Truth AI Forensics Assistant. Ask me to verify any claim, extract entities, or compare satellite passes against ground imagery.",
      timestamp: "Just now",
      confidence: 99.8
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const quickPrompts = [
    "Is this container image real?",
    "Show satellite evidence for Rotterdam",
    "Analyze shadow & solar angle consistency",
    "Extract all locations and dates"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsAnalyzing(true);

    setTimeout(() => {
      let aiReply = "Analyzing claim across Sentinel-2 orbital imagery and C2PA wire archives... Verdict: 94% Verified Authentic.";
      let citations = ["Maxar WorldView-3 Satellite Pass #884", "Reuters Ground Wire #4920"];

      if (query.toLowerCase().includes("satellite")) {
        aiReply = "Ingested Sentinel-2 infrared pass at 09:14 UTC. 1,420 shipping containers confirmed docked at Terminal 4 with zero pixel manipulation.";
        citations = ["Sentinel-2 ESA Orbit Pass", "Rotterdam Port AIS Vessel Telemetry"];
      } else if (query.toLowerCase().includes("shadow")) {
        aiReply = "Shadow vector calculation: Sun elevation angle was 48.2° at 09:14 UTC. Ground camera optical model matches solar azimuth within 0.1° variance.";
      } else if (query.toLowerCase().includes("extract")) {
        aiReply = "Extracted 4 Entities: [Location: Port of Rotterdam (51.9515° N)], [Organization: Sentinel-2], [Event: Trade Logistics], [Date: Aug 8, 2026].";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        confidence: 94.2
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAnalyzing(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-lg bg-[#090d16] border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0f19]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-base">Truth Matrix AI Assistant</h3>
              <p className="text-[0.65rem] font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE • C2PA Forensics Pipeline Ready
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="bg-slate-800/80 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 border border-slate-700/60 hover:border-orange-500/40 text-[0.68rem] font-mono px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border text-xs font-bold",
                  msg.sender === "user"
                    ? "bg-orange-500 text-white border-orange-400"
                    : "bg-slate-900 text-orange-400 border-slate-800"
                )}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={cn(
                  "p-3.5 rounded-2xl space-y-2 border",
                  msg.sender === "user"
                    ? "bg-orange-500/10 border-orange-500/30 text-white"
                    : "bg-slate-900/90 border-slate-800 text-slate-200"
                )}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[0.65rem]">
                    <span className="text-orange-400 font-bold">CITATIONS:</span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="text-slate-400 flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 text-slate-500" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="h-8 w-8 rounded-xl bg-slate-900 text-orange-400 border border-slate-800 flex items-center justify-center">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-slate-400 font-mono text-xs flex items-center gap-2">
                <span className="animate-pulse">Cross-matching satellite feeds & spectral EXIF...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#0b0f19]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI or paste claim/image URL..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-400 text-white p-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
