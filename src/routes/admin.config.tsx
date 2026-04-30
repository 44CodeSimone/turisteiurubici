import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { useData } from "@/data/store";
import { updateConfig } from "@/data/repo";
import type { Config, FAQItem } from "@/data/types";
import { Field, TextInput, TextArea, PrimaryButton, GhostButton } from "@/components/admin/Field";

export const Route = createFileRoute("/admin/config")({
  component: AdminConfig,
});

function AdminConfig() {
  const data = useData();
  const [c, setC] = useState<Config>(data.config);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function set<K extends keyof Config>(k: K, v: Config[K]) {
    setC((prev) => ({ ...prev, [k]: v }));
  }

  function save() {
    updateConfig(c);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  }

  function addFAQ() {
    set("faq", [...c.faq, { id: `f-${Date.now()}`, pergunta: "", resposta: "" } as FAQItem]);
  }
  function updFAQ(i: number, patch: Partial<FAQItem>) {
    set("faq", c.faq.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }
  function rmFAQ(i: number) {
    set("faq", c.faq.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">Textos institucionais, contatos e FAQ.</p>
        </div>
        <PrimaryButton onClick={save}>
          <Save className="h-4 w-4" /> Salvar alterações
        </PrimaryButton>
      </div>

      {savedAt && <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">Configurações salvas.</div>}

      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Identidade</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome da plataforma" className="sm:col-span-2">
            <TextInput value={c.nomePlataforma} onChange={(e) => set("nomePlataforma", e.target.value)} />
          </Field>
          <Field label="WhatsApp (com DDI, só números)">
            <TextInput value={c.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </Field>
          <Field label="Instagram">
            <TextInput value={c.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </Field>
          <Field label="E-mail">
            <TextInput value={c.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Textos do site</h2>
        <Field label="Texto da home (subtítulo do hero)">
          <TextArea value={c.textoHome} onChange={(e) => set("textoHome", e.target.value)} rows={3} />
        </Field>
        <Field label="Texto institucional (rodapé)">
          <TextArea value={c.textoSobre} onChange={(e) => set("textoSobre", e.target.value)} rows={3} />
        </Field>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Perguntas frequentes</h2>
          <GhostButton onClick={addFAQ}>
            <Plus className="h-4 w-4" /> Adicionar
          </GhostButton>
        </div>
        <div className="space-y-3">
          {c.faq.map((f, i) => (
            <div key={f.id} className="rounded-xl border border-border p-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Field label="Pergunta">
                    <TextInput value={f.pergunta} onChange={(e) => updFAQ(i, { pergunta: e.target.value })} />
                  </Field>
                  <Field label="Resposta">
                    <TextArea value={f.resposta} onChange={(e) => updFAQ(i, { resposta: e.target.value })} rows={2} />
                  </Field>
                </div>
                <button
                  onClick={() => rmFAQ(i)}
                  className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <PrimaryButton onClick={save}>
          <Save className="h-4 w-4" /> Salvar alterações
        </PrimaryButton>
      </div>
    </div>
  );
}
