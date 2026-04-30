import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Power, Trash2, Calendar } from "lucide-react";
import { useData } from "@/data/store";
import { newEmptyEvento, upsertEvento, removeEvento } from "@/data/repo";
import type { Evento } from "@/data/types";
import { AdminModal } from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, Toggle, PrimaryButton, GhostButton } from "@/components/admin/Field";

export const Route = createFileRoute("/admin/eventos")({
  component: AdminEventos,
});

function AdminEventos() {
  const data = useData();
  const [editing, setEditing] = useState<Evento | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">Eventos</h1>
          <p className="text-sm text-muted-foreground mt-1">Agenda cultural e festivais.</p>
        </div>
        <PrimaryButton onClick={() => setEditing(newEmptyEvento())}>
          <Plus className="h-4 w-4" /> Novo evento
        </PrimaryButton>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.eventos.map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            {e.imagem && <img src={e.imagem} alt="" className="aspect-[16/9] w-full object-cover bg-muted" />}
            <div className="p-4">
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(e.data)} {e.horario && `• ${e.horario}`}
              </div>
              <div className="font-medium mt-1">{e.nome}</div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{e.descricao}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-[11px] rounded-full px-2 py-0.5 ${e.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {e.ativo ? "Ativo" : "Inativo"}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => upsertEvento({ ...e, ativo: !e.ativo })} className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent">
                    <Power className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditing(e)} className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => confirm(`Excluir "${e.nome}"?`) && removeEvento(e.id)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <EventoForm initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function EventoForm({ initial, onClose }: { initial: Evento; onClose: () => void }) {
  const [e, setE] = useState<Evento>(initial);
  function save() {
    if (!e.nome.trim() || !e.data) {
      alert("Informe nome e data.");
      return;
    }
    upsertEvento(e);
    onClose();
  }
  return (
    <AdminModal
      open
      onClose={onClose}
      title={initial.nome ? `Editar: ${initial.nome}` : "Novo evento"}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton onClick={save}>Salvar</PrimaryButton>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nome" required className="sm:col-span-2">
          <TextInput value={e.nome} onChange={(ev) => setE({ ...e, nome: ev.target.value })} />
        </Field>
        <Field label="Descrição" className="sm:col-span-2">
          <TextArea value={e.descricao} onChange={(ev) => setE({ ...e, descricao: ev.target.value })} rows={3} />
        </Field>
        <Field label="Data" required>
          <TextInput type="date" value={e.data} onChange={(ev) => setE({ ...e, data: ev.target.value })} />
        </Field>
        <Field label="Horário">
          <TextInput value={e.horario ?? ""} onChange={(ev) => setE({ ...e, horario: ev.target.value })} placeholder="Ex.: 18h" />
        </Field>
        <Field label="Local" className="sm:col-span-2">
          <TextInput value={e.local ?? ""} onChange={(ev) => setE({ ...e, local: ev.target.value })} />
        </Field>
        <Field label="Imagem (URL)" className="sm:col-span-2">
          <TextInput value={e.imagem ?? ""} onChange={(ev) => setE({ ...e, imagem: ev.target.value })} placeholder="https://" />
        </Field>
        <Field label="Link" className="sm:col-span-2">
          <TextInput value={e.link ?? ""} onChange={(ev) => setE({ ...e, link: ev.target.value })} placeholder="https://" />
        </Field>
        <Toggle checked={e.ativo} onChange={(v) => setE({ ...e, ativo: v })} label="Ativo" />
      </div>
    </AdminModal>
  );
}
