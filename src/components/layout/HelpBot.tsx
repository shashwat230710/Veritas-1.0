import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Send,
  Sparkles,
  ShieldCheck,
  Globe,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Bot,
  Zap,
  TrendingUp,
  HelpCircle,
  X,
  Minimize2,
  Flame,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { VerdictChip } from "@/components/feed/VerdictChip";
import { TruthMeter } from "@/components/feed/TruthMeter";
import { evaluateNewsQuery, type EvaluationResult } from "@/lib/newsAssistantEngine";
import { useMemeMode } from "@/lib/useMemeMode";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  evaluation?: EvaluationResult;
  timestamp: string;
}

const STANDARD_TOPICS = [
  {
    icon: Zap,
    label: "Quantum Encryption",
    query: "Is the news about quantum processors breaking RSA 2048 encryption real?",
  },
  {
    icon: TrendingUp,
    label: "$4.2B Clean Energy Bill",
    query: "Re-evaluate government claims about the $4.2B clean energy infrastructure package.",
  },
  {
    icon: Globe,
    label: "WHO Air Quality",
    query: "Did WHO issue new strict guidelines on PM2.5 air quality safety?",
  },
  {
    icon: Search,
    label: "Groundwater Crisis",
    query: "Fact check underreported news on central watershed aquifer depletion.",
  },
];

const MEME_TOPICS = [
  {
    icon: Flame,
    label: "Bust This Cap 🧢",
    query: "Is the news about AI replacing coders next Tuesday real or absolute cap?",
  },
  {
    icon: Zap,
    label: "Spicy Tech Rumors 🌶️",
    query: "Give me the raw no-cap breakdown of the latest Chinese chipmaker stocks surge.",
  },
  {
    icon: Globe,
    label: "Alien Telemetry 🛸",
    query: "Did scientists actually intercept extraterrestrial signals or is it space debris?",
  },
  {
    icon: Search,
    label: "Hood Ground Truth 💯",
    query: "Fact check this headline and tell me if it's a W or a massive L.",
  },
];

export function HelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [searchStep, setSearchStep] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { memeMode } = useMemeMode();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, searchStep, isOpen]);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (userMessage: string) => {
      setSearchStep(memeMode ? "🧢 Checking cap levels across the matrix..." : "🔍 Searching global news databases & wire reports...");
      await new Promise((r) => setTimeout(r, 600));

      setSearchStep(memeMode ? "🔥 Sniffing out fake news & spicy claims..." : "📰 Cross-referencing source credibility & verified datasets...");
      await new Promise((r) => setTimeout(r, 600));

      setSearchStep(memeMode ? "💯 Calculating Chad Ground Truth Precision..." : "📊 Synthesizing Veritas Ground Truth score...");
      await new Promise((r) => setTimeout(r, 500));

      try {
        const historyForEdge = [...messages, { role: "user" as const, content: userMessage }].map(
          (m) => ({ role: m.role, content: m.content })
        );

        const { data, error } = await supabase.functions.invoke("chat", {
          body: { messages: historyForEdge, memeMode },
        });

        if (!error && data && data.reply) {
          const evalRes = await evaluateNewsQuery(userMessage, memeMode);
          return {
            reply: data.reply as string,
            evaluation: evalRes,
          };
        }
      } catch (err) {
        console.warn("Edge function fallback to client engine:", err);
      }

      const evalRes = await evaluateNewsQuery(userMessage, memeMode);
      return {
        reply: evalRes.reply,
        evaluation: evalRes,
      };
    },
    onSuccess: (data) => {
      setSearchStep("");
      const botMsg: ChatMessage = {
        id: "msg-" + Date.now(),
        role: "assistant",
        content: data.reply,
        evaluation: data.evaluation,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    },
    onError: (err) => {
      setSearchStep("");
      const errorMsg: ChatMessage = {
        id: "msg-" + Date.now(),
        role: "assistant",
        content: `⚠️ Unable to process query right now: ${err instanceof Error ? err.message : String(err)}. Please try rephrasing your prompt.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    },
  });

  const handleSend = (textToSend?: string) => {
    const queryStr = (textToSend || input).trim();
    if (!queryStr || isPending) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: queryStr,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    sendMessage(queryStr);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeTopics = memeMode ? MEME_TOPICS : STANDARD_TOPICS;

  return (
    <>
      {/* Floating Circular Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-3 duration-300 ${
            memeMode
              ? "bg-amber-500/20 border-amber-400/60 text-amber-300 font-bold animate-pulse"
              : "bg-[#1c2333]/90 border-white/10 text-white/90"
          }`}>
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>{memeMode ? "Ask Chad AI 🤖🔥" : "Ask Veritas AI"}</span>
          </span>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Help Bot"
          className={`group relative flex h-14 w-14 items-center justify-center rounded-full p-0.5 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            memeMode
              ? "bg-gradient-to-tr from-amber-400 via-yellow-500 to-rose-500 shadow-amber-500/50 animate-bounce"
              : "bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-orange-500/30"
          }`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#141926] text-orange-400 group-hover:bg-[#1a2133] transition-colors relative">
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Bot className={`h-7 w-7 transition-colors ${memeMode ? "text-amber-400" : "text-orange-400"}`} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Expanded Chat Window Space */}
      {isOpen && (
        <div className={`fixed bottom-24 right-4 sm:right-6 z-50 flex h-[600px] max-h-[82vh] w-[92vw] sm:w-[420px] flex-col overflow-hidden rounded-3xl border text-white shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-6 duration-200 ${
          memeMode
            ? "bg-[#131824]/95 border-amber-500/40 shadow-amber-500/20"
            : "bg-[#131824]/95 border-white/10"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#1a2133]/60 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-2xl text-white font-bold shadow-md ${
                memeMode ? "bg-gradient-to-tr from-amber-400 to-rose-500 shadow-amber-500/30" : "bg-gradient-to-tr from-orange-500 to-amber-500 shadow-orange-500/20"
              }`}>
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-bold text-white">
                    {memeMode ? "Veritas Chad AI 🤖🔥" : "Veritas AI Help Bot"}
                  </h3>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[0.7rem] text-slate-400">
                  {memeMode ? "100% No Cap Truth Engine" : "Live Global News Grounding"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Meme Mode Banner if active */}
          {memeMode && (
            <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 text-[0.7rem] text-amber-300 flex items-center justify-between font-bold tracking-wide">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" /> ✨ MEME MODE ACTIVE • NO CAP
              </span>
              <Link to="/settings" onClick={() => setIsOpen(false)} className="underline hover:text-white">
                Disable
              </Link>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs scrollbar-thin">
            {messages.length === 0 && (
              <div className="space-y-4 py-3">
                <div className={`rounded-2xl border p-4 text-center space-y-2 ${
                  memeMode ? "border-amber-500/30 bg-amber-500/5 text-amber-200" : "border-white/10 bg-[#1c2436]/60 text-slate-300"
                }`}>
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-2xl ${
                    memeMode ? "bg-amber-500/20 text-amber-400" : "bg-orange-500/10 text-orange-400"
                  }`}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-white">
                    {memeMode ? "Sup Chief! Ready to bust some fake news cap? 🧢" : "How can I help verify today?"}
                  </h4>
                  <p className="text-[0.75rem] leading-relaxed">
                    {memeMode
                      ? "Ask me anything or paste a claim. I'll break down the ground truth with zero cap and maximum spice."
                      : "Ask me any question, paste a news link, or check global claims against verified wire sources in real-time."}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className={`text-[0.68rem] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    memeMode ? "text-amber-400" : "text-orange-400"
                  }`}>
                    <HelpCircle className="h-3.5 w-3.5" /> Preset Quick Queries
                  </span>
                  <div className="grid gap-2">
                    {activeTopics.map((topic, idx) => {
                      const Icon = topic.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSend(topic.query)}
                          className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all group ${
                            memeMode
                              ? "border-amber-500/20 bg-[#1e2333] hover:border-amber-400/60 hover:bg-[#252c40]"
                              : "border-white/5 bg-[#182030] hover:border-orange-500/50 hover:bg-[#1f293d]"
                          }`}
                        >
                          <div className={`rounded-lg p-1.5 group-hover:scale-110 transition-transform ${
                            memeMode ? "bg-amber-500/20 text-amber-400" : "bg-orange-500/10 text-orange-400"
                          }`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[0.75rem] font-semibold transition-colors ${
                              memeMode ? "text-amber-200 group-hover:text-amber-400" : "text-slate-200 group-hover:text-orange-400"
                            }`}>
                              {topic.label}
                            </div>
                            <div className="text-[0.68rem] text-slate-400 truncate">
                              {topic.query}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white font-bold text-[0.65rem] mt-0.5 ${
                    memeMode ? "bg-amber-500" : "bg-orange-500"
                  }`}>
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[88%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                  {m.role === "user" ? (
                    <div className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                      memeMode
                        ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold"
                        : "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                    }`}>
                      {m.content}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-[#1c2436] p-3.5 space-y-3 shadow-md text-xs">
                      {/* Evaluation Score & Verdict Header */}
                      {m.evaluation?.verdict && m.evaluation?.truthScore !== undefined && (
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 bg-[#141926]/40 -mx-3.5 -mt-3.5 p-3 rounded-t-2xl">
                          <TruthMeter
                            score={m.evaluation.truthScore}
                            verdict={m.evaluation.verdict}
                          />
                          <VerdictChip verdict={m.evaluation.verdict} />
                        </div>
                      )}

                      <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                        {m.content}
                      </div>

                      {/* Supporting Evidence */}
                      {m.evaluation?.supporting && m.evaluation.supporting.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1 text-[0.68rem] font-semibold uppercase text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Supporting ({m.evaluation.supporting.length})</span>
                          </div>
                          <div className="space-y-1">
                            {m.evaluation.supporting.map((sup, sIdx) => (
                              <a
                                key={sIdx}
                                href={sup.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[0.7rem] text-slate-300 hover:border-emerald-500/50 transition-colors"
                              >
                                <div className="line-clamp-2">{sup.snippet}</div>
                                <div className="text-[0.65rem] text-emerald-400 mt-0.5 underline">
                                  {sup.source}
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contradicting Evidence */}
                      {m.evaluation?.contradicting && m.evaluation.contradicting.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1 text-[0.68rem] font-semibold uppercase text-rose-400">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Contradicting ({m.evaluation.contradicting.length})</span>
                          </div>
                          <div className="space-y-1">
                            {m.evaluation.contradicting.map((con, cIdx) => (
                              <a
                                key={cIdx}
                                href={con.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block p-2 rounded-lg bg-rose-950/30 border border-rose-800/40 text-[0.7rem] text-slate-300 hover:border-rose-500/50 transition-colors"
                              >
                                <div className="line-clamp-2">{con.snippet}</div>
                                <div className="text-[0.65rem] text-rose-400 mt-0.5 underline">
                                  {con.source}
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Followups */}
                      {m.evaluation?.suggestedFollowups && m.evaluation.suggestedFollowups.length > 0 && (
                        <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1">
                          {m.evaluation.suggestedFollowups.map((fol, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSend(fol)}
                              className="text-[0.65rem] px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-orange-300 transition-colors border border-white/10"
                            >
                              {fol}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[0.65rem] text-slate-400 border-t border-white/5">
                        <span>{m.timestamp}</span>
                        <button
                          onClick={() => copyToClipboard(m.id, m.content)}
                          className="hover:text-white transition-colors"
                        >
                          {copiedId === m.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex gap-2.5 items-start animate-pulse">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white font-bold text-[0.65rem] mt-0.5 ${
                  memeMode ? "bg-amber-500" : "bg-orange-500"
                }`}>
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl border border-orange-500/30 bg-[#1c2436] p-3 space-y-1.5 text-xs text-orange-300 max-w-[85%] shadow-md">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    <span>{searchStep || "Analyzing news query..."}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-white/10 bg-[#161c2b] p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={memeMode ? "Type any claim to check for cap... 🧢" : "Ask anything or check any headline..."}
              className="flex-1 bg-[#101420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-orange-500/60 transition-colors"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-1 shadow-md ${
                memeMode ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold shadow-amber-500/30" : "bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/20"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
