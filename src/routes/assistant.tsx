import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Send, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function useMemeMode(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile-meme-mode", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("meme_mode").eq("id", userId!).single();
      return data?.meme_mode ?? false;
    },
  });
}

function useChat(memeMode: boolean) {
  return useMutation({
    mutationFn: async (messages: ChatMessage[]) => {
      // Calls the `chat` Edge Function — see supabase/functions/chat.
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages, memeMode },
      });
      if (error) throw error;
      return data.reply as string;
    },
  });
}

function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { user } = useSession();
  const { data: memeMode = false } = useMemeMode(user?.id);
  const { mutate, isPending } = useChat(memeMode);

  function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(next);
    setInput("");
    mutate(next, {
      onSuccess: (reply) =>
        setMessages((m) => [...m, { role: "assistant", content: reply }]),
    });
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-2xl flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl">Assistant</h1>
          <p className="mt-1 text-muted-foreground">
            Ask about anything in the news — grounded in live search, not just
            training data.
          </p>
        </div>
        {memeMode && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
            <Sparkles className="h-3 w-3" />
            Meme Mode
          </span>
        )}
      </div>
      {!memeMode && (
        <Link to="/settings" className="mt-1 text-xs text-muted-foreground underline decoration-dotted">
          Turn on Meme Mode in Settings
        </Link>
      )}

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl bg-primary/15 px-4 py-2 text-sm"
                : "mr-auto max-w-[80%] rounded-2xl bg-card px-4 py-2 text-sm whitespace-pre-wrap"
            }
          >
            {m.content}
          </div>
        ))}
        {isPending && (
          <div className="mr-auto max-w-[80%] rounded-2xl bg-card px-4 py-2 text-sm text-muted-foreground">
            Thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-4 flex gap-2 rounded-full border border-border bg-card px-4 py-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button type="submit" disabled={!input.trim() || isPending}>
          <Send className="h-4 w-4 text-primary" />
        </button>
      </form>
    </div>
  );
}
