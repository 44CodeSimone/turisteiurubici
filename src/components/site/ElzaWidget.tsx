import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useData } from "@/data/store";

interface Msg { role: "user" | "assistant"; content: string; }

const SAUDACAO: Msg = {
  role: "assistant",
  content:
    "Oi! Eu sou a Elza 💚 Posso te ajudar a descobrir Urubici — pontos turísticos, onde comer, dormir, eventos e experiências. O que você procura hoje?",
};

export function ElzaWidget() {
  const data = useData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([SAUDACAO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const locaisCtx = data.locais
        .filter((l) => l.ativo)
        .map((l) => ({ nome: l.nome, categoria: l.categoria, descricaoCurta: l.descricaoCurta }));
      const { data: resp, error } = await supabase.functions.invoke("elza-chat", {
        body: { messages: next, locais: locaisCtx },
      });
      if (error) throw error;
      const reply = (resp as any)?.reply ?? "Desculpe, tive um probleminha agora. Pode tentar novamente?";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Estou com instabilidade no momento. Tente novamente em instantes." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary-gradient px-5 py-3.5 text-primary-foreground shadow-elegant transition-bounce hover:scale-105 active:scale-95 ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Abrir chat com Elza"
      >
        <Sparkles className="h-5 w-5" />
        <span className="text-sm font-medium">Fale com a Elza</span>
      </button>

      {/* Janela de chat */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[400px] transition-bounce ${
          open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-[80vh] sm:h-[600px] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-border bg-card shadow-elegant">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-primary-gradient px-4 py-3.5 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base font-semibold">Elza</div>
                <div className="text-[11px] opacity-85">Assistente turística • online</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 transition-smooth"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mensagens */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-soft-gradient">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-foreground border border-border rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-card border border-border px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "240ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex items-center gap-2 border-t border-border bg-card p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre Urubici…"
              className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-smooth"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-gradient text-primary-foreground shadow-soft transition-bounce hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// Ícone usado no botão fechado em Hero CTA, não removido para evitar tree-shaking issue
export const _MessageCircle = MessageCircle;
