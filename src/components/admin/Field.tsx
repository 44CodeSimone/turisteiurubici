import { type ReactNode } from "react";

export function Field({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="text-xs font-medium text-foreground/80 mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </div>
      {children}
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </label>
  );
}

const baseInput =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-smooth";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} min-h-[88px] resize-y ${props.className ?? ""}`} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 select-none"
      aria-pressed={checked}
    >
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-bounce ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

export function ImageListInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {value.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={url}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder="https://…"
            className={baseInput}
          />
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-10 w-10 rounded-lg object-cover bg-muted shrink-0" />
          )}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-xs text-destructive hover:underline shrink-0"
          >
            Remover
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="text-xs font-medium text-primary hover:underline"
      >
        + Adicionar imagem (URL)
      </button>
    </div>
  );
}

export function StringListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={s}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className={baseInput}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-xs text-destructive hover:underline shrink-0"
          >
            Remover
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="text-xs font-medium text-primary hover:underline"
      >
        + Adicionar item
      </button>
    </div>
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-full bg-primary-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-bounce hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${props.className ?? ""}`}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-smooth ${props.className ?? ""}`}
    />
  );
}

export function DangerButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 text-sm font-medium hover:bg-destructive/15 transition-smooth ${props.className ?? ""}`}
    />
  );
}
