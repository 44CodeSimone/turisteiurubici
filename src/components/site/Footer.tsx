import { Link } from "@tanstack/react-router";
import { Mountain, Instagram, Mail } from "lucide-react";
import { useData } from "@/data/store";

export function Footer() {
  const { config } = useData();
  return (
    <footer className="mt-20 border-t border-border bg-soft-gradient">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient">
              <Mountain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display text-lg font-semibold">{config.nomePlataforma}</div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">{config.footerTexto || config.textoSobre}</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Navegação</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-smooth">Início</Link></li>
            <li><Link to="/explorar" search={{ cat: undefined, q: undefined } as any} className="hover:text-foreground transition-smooth">Explorar</Link></li>
            <li><Link to="/empresas" className="hover:text-foreground transition-smooth">Para empresas</Link></li>
            <li><Link to="/privacidade" className="hover:text-foreground transition-smooth">Privacidade</Link></li>
            <li><Link to="/termos" className="hover:text-foreground transition-smooth">Termos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Contato</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{config.email}</span></li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /><span>{config.instagram}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-5 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.nomePlataforma}. Todos os direitos reservados.</span>
          <span className="opacity-80">Produto desenvolvido por <span className="font-semibold text-foreground/70">44CODE</span> — Soluções e Tecnologia</span>
        </div>
      </div>
    </footer>
  );
}
