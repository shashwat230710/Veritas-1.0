import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Bot, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  component: AssistantRedirectPage,
});

function AssistantRedirectPage() {
  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-6 font-sans">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xl shadow-orange-500/20">
        <Bot className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400">
          <Sparkles className="h-3.5 w-3.5" /> Floating Help Bot Active
        </div>
        <h1 className="text-3xl font-bold text-white">Veritas AI Help Bot</h1>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          The Veritas AI Assistant is now conveniently available anywhere in the app as a circular help bot in the bottom right corner!
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-white/10 bg-[#161c2b] text-xs text-slate-400 max-w-md mx-auto space-y-2">
        <p className="font-semibold text-white">💡 Quick Tip:</p>
        <p>Click the glowing orange bot circle on the bottom right of your screen anytime to ask questions, verify live news headlines, or evaluate claims.</p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-orange-400 font-semibold animate-bounce">
        <span>Look for the floating circle in bottom right corner</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}
