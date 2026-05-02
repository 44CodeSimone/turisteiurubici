import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "turistei:cookies-accepted";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(KEY)) setShow(true);
  }, []);

  if (!show) return null;

  function accept() {
    try { window.localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  }

  return (
    <div className="fixed inset-x-2 bottom-2 z-[60] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md">
      <div className="rounded-2xl border border-border bg-card/95 backdrop-blur px-4 py-3.5 shadow-elegant">
        <p className="text-xs text-foreground/85 leading-relaxed">
          Usamos cookies essenciais para o funcionamento da plataforma e para melhorar sua experiência.
          Saiba mais em{" "}
          <Link to="/privacidade" className="text-primary underline">privacidade</Link>{" "}
          e{" "}
          <Link to="/termos" className="text-primary underline">termos</Link>.
        </p>
        <div className="mt-3 flex justify-end">
          <button
            onClick={accept}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
