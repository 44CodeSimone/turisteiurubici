import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Star, Power, Trash2, MapPin, PlayCircle, PauseCircle, XCircle } from "lucide-react";
import { useData } from "@/data/store";
import { newEmptyLocal, removeLocal, toggleLocalAtivo, toggleLocalDestaque, getCategoria, setLocalStatusContrato } from "@/data/repo";
import type { Local } from "@/data/types";
import { effectiveStatus, STATUS_LABEL, STATUS_TONE } from "@/lib/cta";
import { LocalForm } from "./LocalForm";
import { PrimaryButton } from "./Field";

interface Props {
  titulo: string;
  subtitulo?: string;
  /** Filtra a lista por categoria. Se passado, novos itens são criados com esta categoria. */
  fixedCategoria?: string;
}

export function LocaisManager({ titulo, subtitulo, fixedCategoria }: Props) {
  const data = useData();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Local | null>(null);
  const [creating, setCreating] = useState<Local | null>(null);

  const list = useMemo(() => {
    return data.locais
      .filter((l) => (fixedCategoria ? l.categoria === fixedCategoria : true))
      .filter((l) => l.nome.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.ordem - b.ordem);
  }, [data.locais, fixedCategoria, q]);

  function handleNew() {
    const empty = newEmptyLocal();
    if (fixedCategoria) empty.categoria = fixedCategoria;
    setCreating(empty);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">{titulo}</h1>
          {subtitulo && <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>}
        </div>
        <PrimaryButton onClick={handleNew}>
          <Plus className="h-4 w-4" /> Novo
        </PrimaryButton>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar…"
          className="w-full rounded-full border border-input bg-background pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Mobile: cards */}
      <div className="grid sm:hidden gap-3">
        {list.map((l) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex gap-3">
              <img src={l.imagens[0]} alt="" className="h-16 w-16 rounded-xl object-cover bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  {l.nome}
                  {l.destaque && <Star className="h-3.5 w-3.5 text-gold fill-gold" />}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {getCategoria(l.categoria)?.nome ?? l.categoria}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{l.endereco}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className={`text-[11px] rounded-full px-2 py-0.5 ${l.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {l.ativo ? "Ativo" : "Inativo"}
              </span>
              <div className="flex items-center gap-1">
                <ActionBtn title="Destacar" onClick={() => toggleLocalDestaque(l.id)} active={l.destaque}>
                  <Star className="h-4 w-4" />
                </ActionBtn>
                <ActionBtn title="Ativar/Inativar" onClick={() => toggleLocalAtivo(l.id)}>
                  <Power className="h-4 w-4" />
                </ActionBtn>
                <ActionBtn title="Editar" onClick={() => setEditing(l)}>
                  <Pencil className="h-4 w-4" />
                </ActionBtn>
                <ActionBtn
                  title="Excluir"
                  onClick={() => confirm(`Excluir "${l.nome}"?`) && removeLocal(l.id)}
                  danger
                >
                  <Trash2 className="h-4 w-4" />
                </ActionBtn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Plano</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((l) => (
              <tr key={l.id} className="hover:bg-accent/40 transition-smooth">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={l.imagens[0]} alt="" className="h-9 w-9 rounded-lg object-cover bg-muted" />
                    <div className="font-medium flex items-center gap-1.5 truncate max-w-[18rem]">
                      <span className="truncate">{l.nome}</span>
                      {l.destaque && <Star className="h-3.5 w-3.5 text-gold fill-gold shrink-0" />}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  {getCategoria(l.categoria)?.nome ?? l.categoria}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium capitalize">{l.plano}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {l.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <ActionBtn title="Destacar" onClick={() => toggleLocalDestaque(l.id)} active={l.destaque}>
                      <Star className="h-4 w-4" />
                    </ActionBtn>
                    <ActionBtn title="Ativar/Inativar" onClick={() => toggleLocalAtivo(l.id)}>
                      <Power className="h-4 w-4" />
                    </ActionBtn>
                    <ActionBtn title="Editar" onClick={() => setEditing(l)}>
                      <Pencil className="h-4 w-4" />
                    </ActionBtn>
                    <ActionBtn
                      title="Excluir"
                      onClick={() => confirm(`Excluir "${l.nome}"?`) && removeLocal(l.id)}
                      danger
                    >
                      <Trash2 className="h-4 w-4" />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Nenhum cadastro ainda. Clique em "Novo" para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <LocalForm open={!!creating} onClose={() => setCreating(null)} initial={creating} fixedCategoria={fixedCategoria} />
      )}
      {editing && (
        <LocalForm open={!!editing} onClose={() => setEditing(null)} initial={editing} fixedCategoria={fixedCategoria} isEdit />
      )}
    </div>
  );
}

function ActionBtn({
  children,
  title,
  onClick,
  active,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-smooth ${
        danger
          ? "hover:bg-destructive/10 text-destructive"
          : active
          ? "bg-gold/15 text-gold-foreground"
          : "hover:bg-accent text-foreground/80"
      }`}
    >
      {children}
    </button>
  );
}
