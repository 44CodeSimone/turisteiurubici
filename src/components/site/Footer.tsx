import { Link } from "@tanstack/react-router";
import { Mountain, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-soft-gradient">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient">
              <Mountain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display text-lg font-semibold">Turistei Urubici</div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            O guia digital da Serra Catarinense. Conectamos turistas, moradores e
            negócios locais para que cada visita a Urubici seja inesquecível.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Navegação</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-smooth">Início</Link></li>
            <li><Link to="/explorar" className="hover:text-foreground transition-smooth">Explorar</Link></li>
            <li><Link to="/empresas" className="hover:text-foreground transition-smooth">Para empresas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Contato</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contato@turisteiurubici.com.br</li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @turisteiurubici</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-5 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Turistei Urubici. Todos os direitos reservados.</span>
          <span>Feito com carinho na Serra Catarinense.</span>
        </div>
      </div>
    </footer>
  );
}
