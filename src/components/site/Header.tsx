import { Link } from "@tanstack/react-router";
import { Mountain, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Início" },
  { to: "/explorar", label: "Explorar" },
  { to: "/empresas", label: "Para empresas" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient shadow-soft transition-bounce group-hover:scale-105">
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-foreground">Turistei Urubici</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Serra Catarinense</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              search={l.to === "/explorar" ? { cat: undefined, q: undefined } as any : undefined as any}
              className="px-4 py-2 text-sm font-medium text-foreground/75 rounded-full transition-smooth hover:text-foreground hover:bg-accent"
              activeProps={{ className: "px-4 py-2 text-sm font-medium rounded-full bg-accent text-accent-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent transition-smooth"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background animate-fade-up">
          <nav className="flex flex-col p-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                search={l.to === "/explorar" ? { cat: undefined, q: undefined } as any : undefined as any}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-smooth"
                activeProps={{ className: "px-4 py-3 text-sm font-medium rounded-lg bg-accent text-accent-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
