import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mountain, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Entrar — Turistei Urubici" }, { name: "robots", content: "noindex" }] }),
});

function LoginPage() {
  const { user, isAdmin, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) navigate({ to: "/admin" });
      else navigate({ to: "/" });
    }
  }, [loading, user, isAdmin, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) setError(traduz(error));
      } else {
        const { error } = await signUp(email, password);
        if (error) setError(traduz(error));
        else setInfo("Conta criada! Você já pode entrar.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-gradient px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient shadow-soft">
            <Mountain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="leading-tight text-center">
            <div className="font-display text-xl font-semibold">Turistei Urubici</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Serra Catarinense</div>
          </div>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-elegant">
          <h1 className="font-display text-2xl font-semibold text-center">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Acesso restrito ao painel administrativo.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground/80 mb-1.5 block">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground/80 mb-1.5 block">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
            {info && <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">{info}</div>}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-bounce hover:scale-[1.01] disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {busy ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
            </button>

            <div className="text-center text-xs text-muted-foreground">
              {mode === "login" ? (
                <>Não tem conta?{" "}
                  <button type="button" onClick={() => { setMode("signup"); setError(null); setInfo(null); }} className="text-primary hover:underline">
                    Criar conta
                  </button>
                </>
              ) : (
                <>Já tem conta?{" "}
                  <button type="button" onClick={() => { setMode("login"); setError(null); setInfo(null); }} className="text-primary hover:underline">
                    Entrar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-smooth">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}

function traduz(msg: string) {
  if (/invalid login credentials/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/user already registered/i.test(msg)) return "E-mail já cadastrado. Faça login.";
  if (/password.*6/i.test(msg)) return "A senha precisa ter ao menos 6 caracteres.";
  return msg;
}
