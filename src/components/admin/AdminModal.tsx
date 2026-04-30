import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
}

export function AdminModal({ open, onClose, title, children, footer, size = "lg" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div
        className={`relative w-full ${size === "lg" ? "sm:max-w-3xl" : "sm:max-w-md"} bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-elegant flex flex-col max-h-[92vh] animate-fade-up`}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-smooth"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">{footer}</div>}
      </div>
    </div>
  );
}
