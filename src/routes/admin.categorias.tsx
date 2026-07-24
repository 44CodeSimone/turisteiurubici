import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Power, Trash2 } from "lucide-react";
import { useData } from "@/data/store";
import { upsertCategoria, removeCategoria } from "@/data/repo";
import type { CategoriaItem } from "@/data/types";
import { AdminModal } from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, Toggle, PrimaryButton, GhostButton } from "@/components/admin/Field";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategorias,
  head: () => ({ meta: [{ title: "Categorias — Admin | Turistei Urubici" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function AdminCategorias() {
  const data = useData();
  const [editing, setEditing] = useState<CategoriaItem | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">Categorias</h1>
          <p className="text-sm text-muted-foreground mt-1">Categorias usadas em todo o site.</p>
        </div>
        <PrimaryButton
          onClick={() =>
            setEditing({ slug: "", nome: "", icon: "MapPin", descricao: "", ordem: data.categorias.length + 1, ativo: true })
          }
        >
          <Plus className="h-4 w-4" /> Nova categoria
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.categorias.map((c) => (
          <div key={c.slug} className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{c.nome}</div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{c.descricao}</div>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="rounded-full bg-muted px-2 py-0.5">slug: {c.slug}</span>
                <span className={`rounded-full px-2 py-0.5 ${c.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {c.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => upsertCategoria({ ...c, ativo: !c.ativo })}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
                title="Ativar/Inativar"
              >
                <Power className="h-4 w-4" />
              </button>
              <button onClick={() => setEditing(c)} className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => confirm(`Excluir "${c.nome}"?`) && removeCategoria(c.slug)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && <CategoriaForm initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function CategoriaForm({ initial, onClose }: { initial: CategoriaItem; onClose: () => void }) {
  const [c, setC] = useState<CategoriaItem>(initial);

  function save() {
    if (!c.nome.trim() || !c.slug.trim()) {
      alert("Informe nome e slug.");
      return;
    }
    upsertCategoria(c);
    onClose();
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title={initial.nome ? `Editar: ${initial.nome}` : "Nova categoria"}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton onClick={save}>Salvar</PrimaryButton>
        </>
      }
      size="md"
    >
      <div className="grid gap-4">
        <Field label="Nome" required>
          <TextInput value={c.nome} onChange={(e) => setC({ ...c, nome: e.target.value })} />
        </Field>
        <Field label="Slug" required hint="Identificador único na URL.">
          <TextInput value={c.slug} onChange={(e) => setC({ ...c, slug: e.target.value })} />
        </Field>
        <Field label="Ícone" hint="Nome do ícone Lucide (ex.: Mountain, Coffee, BedDouble).">
          <TextInput value={c.icon} onChange={(e) => setC({ ...c, icon: e.target.value })} />
        </Field>
        <Field label="Descrição">
          <TextArea value={c.descricao} onChange={(e) => setC({ ...c, descricao: e.target.value })} rows={2} />
        </Field>
        <Field label="Ordem">
          <TextInput type="number" value={c.ordem} onChange={(e) => setC({ ...c, ordem: parseInt(e.target.value) || 0 })} />
        </Field>
        <Toggle checked={c.ativo} onChange={(v) => setC({ ...c, ativo: v })} label="Categoria ativa" />
      </div>
    </AdminModal>
  );
}
