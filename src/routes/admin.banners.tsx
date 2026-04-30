import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Power, Trash2 } from "lucide-react";
import { useData } from "@/data/store";
import { newEmptyBanner, upsertBanner, removeBanner } from "@/data/repo";
import type { Banner } from "@/data/types";
import { AdminModal } from "@/components/admin/AdminModal";
import { Field, TextInput, SelectInput, Toggle, PrimaryButton, GhostButton } from "@/components/admin/Field";

export const Route = createFileRoute("/admin/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  const data = useData();
  const [editing, setEditing] = useState<Banner | null>(null);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">Banners promocionais exibidos no site.</p>
        </div>
        <PrimaryButton onClick={() => setEditing(newEmptyBanner())}>
          <Plus className="h-4 w-4" /> Novo banner
        </PrimaryButton>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {data.banners.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            {b.imagem && <img src={b.imagem} alt="" className="aspect-[21/9] w-full object-cover bg-muted" />}
            <div className="p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{b.posicao}</div>
              <div className="font-medium mt-1">{b.titulo}</div>
              {b.subtitulo && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{b.subtitulo}</div>}
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-[11px] rounded-full px-2 py-0.5 ${b.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {b.ativo ? "Ativo" : "Inativo"}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => upsertBanner({ ...b, ativo: !b.ativo })} className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent">
                    <Power className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditing(b)} className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-accent">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => confirm(`Excluir banner?`) && removeBanner(b.id)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {data.banners.length === 0 && (
          <div className="sm:col-span-2 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            Nenhum banner cadastrado.
          </div>
        )}
      </div>

      {editing && <BannerForm initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BannerForm({ initial, onClose }: { initial: Banner; onClose: () => void }) {
  const [b, setB] = useState<Banner>(initial);
  function save() {
    if (!b.titulo.trim() || !b.imagem.trim()) {
      alert("Informe título e imagem.");
      return;
    }
    upsertBanner(b);
    onClose();
  }
  return (
    <AdminModal
      open
      onClose={onClose}
      title={initial.titulo ? `Editar: ${initial.titulo}` : "Novo banner"}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton onClick={save}>Salvar</PrimaryButton>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Título" required className="sm:col-span-2">
          <TextInput value={b.titulo} onChange={(e) => setB({ ...b, titulo: e.target.value })} />
        </Field>
        <Field label="Subtítulo" className="sm:col-span-2">
          <TextInput value={b.subtitulo ?? ""} onChange={(e) => setB({ ...b, subtitulo: e.target.value })} />
        </Field>
        <Field label="Imagem (URL)" required className="sm:col-span-2">
          <TextInput value={b.imagem} onChange={(e) => setB({ ...b, imagem: e.target.value })} placeholder="https://" />
        </Field>
        <Field label="Link" className="sm:col-span-2">
          <TextInput value={b.link ?? ""} onChange={(e) => setB({ ...b, link: e.target.value })} placeholder="/explorar ou https://" />
        </Field>
        <Field label="Posição">
          <SelectInput value={b.posicao} onChange={(e) => setB({ ...b, posicao: e.target.value as Banner["posicao"] })}>
            <option value="home-hero">Home — topo</option>
            <option value="home-meio">Home — meio</option>
            <option value="explorar">Explorar</option>
          </SelectInput>
        </Field>
        <Field label="Ordem">
          <TextInput type="number" value={b.ordem} onChange={(e) => setB({ ...b, ordem: parseInt(e.target.value) || 0 })} />
        </Field>
        <Toggle checked={b.ativo} onChange={(v) => setB({ ...b, ativo: v })} label="Ativo" />
      </div>
    </AdminModal>
  );
}
