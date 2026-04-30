import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Power, Trash2, Star } from "lucide-react";
import { useData } from "@/data/store";
import { newEmptyPlano, upsertPlano, removePlano } from "@/data/repo";
import type { PlanoItem } from "@/data/types";
import { AdminModal } from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, StringListInput, Toggle, PrimaryButton, GhostButton } from "@/components/admin/Field";

export const Route = createFileRoute("/admin/planos")({
  component: AdminPlanos,
});

function AdminPlanos() {
  const data = useData();
  const [editing, setEditing] = useState<PlanoItem | null>(null);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">Planos comerciais</h1>
          <p className="text-sm text-muted-foreground mt-1">Pacotes oferecidos para empresas.</p>
        </div>
        <PrimaryButton onClick={() => setEditing(newEmptyPlano())}>
          <Plus className="h-4 w-4" /> Novo plano
        </PrimaryButton>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {data.planos.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 ${p.destaque ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-display text-lg font-semibold flex items-center gap-1.5">
                  {p.nome}
                  {p.destaque && <Star className="h-4 w-4 text-gold fill-gold" />}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{p.descricao}</div>
              </div>
              <span className={`text-[11px] rounded-full px-2 py-0.5 ${p.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {p.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="mt-3 text-sm font-medium">{p.valor}</div>
            <ul className="mt-3 text-xs text-muted-foreground space-y-1">
              {p.beneficios.slice(0, 4).map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end gap-1">
              <button onClick={() => upsertPlano({ ...p, ativo: !p.ativo })} className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent">
                <Power className="h-4 w-4" />
              </button>
              <button onClick={() => setEditing(p)} className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => confirm(`Excluir "${p.nome}"?`) && removePlano(p.id)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && <PlanoForm initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function PlanoForm({ initial, onClose }: { initial: PlanoItem; onClose: () => void }) {
  const [p, setP] = useState<PlanoItem>(initial);
  function save() {
    if (!p.nome.trim()) {
      alert("Informe o nome.");
      return;
    }
    upsertPlano(p);
    onClose();
  }
  return (
    <AdminModal
      open
      onClose={onClose}
      title={initial.nome ? `Editar: ${initial.nome}` : "Novo plano"}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton onClick={save}>Salvar</PrimaryButton>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nome" required>
          <TextInput value={p.nome} onChange={(e) => setP({ ...p, nome: e.target.value })} />
        </Field>
        <Field label="Valor">
          <TextInput value={p.valor} onChange={(e) => setP({ ...p, valor: e.target.value })} placeholder="Sob consulta" />
        </Field>
        <Field label="Descrição" className="sm:col-span-2">
          <TextArea value={p.descricao} onChange={(e) => setP({ ...p, descricao: e.target.value })} rows={2} />
        </Field>
        <Field label="Benefícios" className="sm:col-span-2">
          <StringListInput
            value={p.beneficios}
            onChange={(v) => setP({ ...p, beneficios: v })}
            placeholder="Ex.: Página completa"
          />
        </Field>
        <Field label="Ordem">
          <TextInput type="number" value={p.ordem} onChange={(e) => setP({ ...p, ordem: parseInt(e.target.value) || 0 })} />
        </Field>
        <div className="flex items-center gap-6 sm:col-span-2">
          <Toggle checked={p.destaque} onChange={(v) => setP({ ...p, destaque: v })} label="Em destaque" />
          <Toggle checked={p.ativo} onChange={(v) => setP({ ...p, ativo: v })} label="Ativo" />
        </div>
      </div>
    </AdminModal>
  );
}
