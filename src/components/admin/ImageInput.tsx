import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** rótulo do botão de upload */
  label?: string;
  className?: string;
  /** altura mínima do preview */
  previewHeight?: string;
}

const MAX_BYTES = 1.5 * 1024 * 1024; // 1.5MB

export function ImageInput({ value, onChange, label = "Imagem", className = "", previewHeight = "h-40" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"upload" | "url">(value?.startsWith("http") ? "url" : "upload");
  const [error, setError] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setError(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("Imagem muito grande. Use até 1.5MB ou cole uma URL.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ""));
    reader.readAsDataURL(f);
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`px-3 py-1.5 rounded-full transition-smooth ${tab === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          <Upload className="inline h-3.5 w-3.5 mr-1" /> Upload
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`px-3 py-1.5 rounded-full transition-smooth ${tab === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          <LinkIcon className="inline h-3.5 w-3.5 mr-1" /> URL
        </button>
      </div>

      {tab === "upload" ? (
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border border-dashed border-input bg-background px-4 py-3 text-sm hover:bg-accent transition-smooth"
          >
            Escolher {label.toLowerCase()}…
          </button>
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-smooth"
        />
      )}

      {error && <div className="text-xs text-destructive">{error}</div>}

      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Pré-visualização"
            className={`w-full ${previewHeight} object-cover rounded-xl bg-muted border border-border`}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ImageListInputV2({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      {value.map((url, i) => (
        <div key={i} className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Imagem {i + 1}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-xs text-destructive hover:underline"
            >
              Remover
            </button>
          </div>
          <ImageInput value={url} onChange={(v) => {
            const next = [...value];
            next[i] = v;
            onChange(next);
          }} />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="text-xs font-medium text-primary hover:underline"
      >
        + Adicionar imagem
      </button>
    </div>
  );
}
