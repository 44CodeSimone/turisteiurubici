import { useState } from "react";
import type { Local } from "@/data/types";
import { useData } from "@/data/store";
import { upsertLocal } from "@/data/repo";
import { slugify } from "@/data/store";
import { AdminModal } from "./AdminModal";
import {
  Field, TextInput, TextArea, SelectInput, Toggle,
  PrimaryButton, GhostButton,
} from "./Field";
import { ImageListInputV2 } from "./ImageInput";
import { CTA_OPTIONS } from "@/lib/cta";

interface Props {
  open: boolean;
  onClose: () => void;
  initial: Local;
  /** Restringe a categoria (ex.: "pontos-turisticos") */
  fixedCategoria?: string;
  isEdit?: boolean;
}

export function LocalForm({ open, onClose, initial, fixedCategoria, isEdit }: Props) {
  const data = useData();
  const [l, setL] = useState<Local>(initial);

  function set<K extends keyof Local>(key: K, value: Local[K]) {
    setL((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!l.nome.trim()) {
      alert("Informe o nome.");
      return;
    }
    const final: Local = {
      ...l,
      slug: l.slug?.trim() || slugify(l.nome),
      categoria: fixedCategoria ?? l.categoria,
    };
    upsertLocal(final);
    onClose();
  }

  const isPonto = (fixedCategoria ?? l.categoria) === "pontos-turisticos";

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? `Editar: ${initial.nome || "novo"}` : "Novo cadastro"}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton onClick={handleSave}>Salvar</PrimaryButton>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nome" required className="sm:col-span-2">
          <TextInput value={l.nome} onChange={(e) => set("nome", e.target.value)} />
        </Field>

        <Field label="Slug (URL)" hint="Deixe vazio para gerar do nome.">
          <TextInput value={l.slug} onChange={(e) => set("slug", e.target.value)} placeholder="exemplo-do-slug" />
        </Field>

        {!fixedCategoria && (
          <Field label="Categoria" required>
            <SelectInput value={l.categoria} onChange={(e) => set("categoria", e.target.value)}>
              {data.categorias.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nome}
                </option>
              ))}
            </SelectInput>
          </Field>
        )}

        <Field label="Descrição curta" hint="Aparece nos cards (até 140 caracteres)." className="sm:col-span-2">
          <TextInput value={l.descricaoCurta} onChange={(e) => set("descricaoCurta", e.target.value)} maxLength={160} />
        </Field>

        <Field label="Descrição completa" className="sm:col-span-2">
          <TextArea value={l.descricao} onChange={(e) => set("descricao", e.target.value)} rows={4} />
        </Field>

        <Field label="Endereço" className="sm:col-span-2">
          <TextInput value={l.endereco} onChange={(e) => set("endereco", e.target.value)} />
        </Field>

        <Field label="Bairro / região">
          <TextInput value={l.bairro ?? ""} onChange={(e) => set("bairro", e.target.value)} />
        </Field>
        <Field label="Horário">
          <TextInput value={l.horario ?? ""} onChange={(e) => set("horario", e.target.value)} placeholder="Ex.: Seg–Sex, 9h às 18h" />
        </Field>

        <Field label="Latitude" required>
          <TextInput
            type="number"
            step="any"
            value={l.latitude}
            onChange={(e) => set("latitude", parseFloat(e.target.value) || 0)}
          />
        </Field>
        <Field label="Longitude" required>
          <TextInput
            type="number"
            step="any"
            value={l.longitude}
            onChange={(e) => set("longitude", parseFloat(e.target.value) || 0)}
          />
        </Field>

        <Field label="WhatsApp" hint="Apenas números, com DDI. Ex.: 5549999990000">
          <TextInput value={l.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="Telefone">
          <TextInput value={l.telefone ?? ""} onChange={(e) => set("telefone", e.target.value)} />
        </Field>
        <Field label="Instagram">
          <TextInput value={l.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="@perfil" />
        </Field>
        <Field label="Site">
          <TextInput value={l.site ?? ""} onChange={(e) => set("site", e.target.value)} placeholder="https://" />
        </Field>
        <Field label="E-mail">
          <TextInput value={l.email ?? ""} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Plano">
          <SelectInput value={l.plano} onChange={(e) => set("plano", e.target.value as Local["plano"])}>
            <option value="presenca">Presença</option>
            <option value="destaque">Destaque</option>
            <option value="premium">Premium</option>
          </SelectInput>
        </Field>

        <Field label="Imagens (upload ou URL)" hint="Formato 4:3 fica melhor. Imagens são redimensionadas automaticamente." className="sm:col-span-2">
          <ImageListInputV2 value={l.imagens} onChange={(v) => set("imagens", v)} />
        </Field>

        {isPonto && (
          <>
            <Field label="Dificuldade">
              <SelectInput
                value={l.dificuldade ?? ""}
                onChange={(e) => set("dificuldade", (e.target.value || undefined) as Local["dificuldade"])}
              >
                <option value="">—</option>
                <option value="facil">Fácil</option>
                <option value="moderada">Moderada</option>
                <option value="dificil">Difícil</option>
              </SelectInput>
            </Field>
            <Field label="Valor de entrada">
              <TextInput value={l.valorEntrada ?? ""} onChange={(e) => set("valorEntrada", e.target.value)} />
            </Field>
            <Field label="Melhor época" className="sm:col-span-2">
              <TextInput value={l.melhorEpoca ?? ""} onChange={(e) => set("melhorEpoca", e.target.value)} />
            </Field>
            <Field label="Estrutura disponível" className="sm:col-span-2">
              <TextInput value={l.estrutura ?? ""} onChange={(e) => set("estrutura", e.target.value)} />
            </Field>
            <Field label="Cuidados" className="sm:col-span-2">
              <TextArea value={l.cuidados ?? ""} onChange={(e) => set("cuidados", e.target.value)} rows={2} />
            </Field>
          </>
        )}

        <Field label="Ordem de exibição">
          <TextInput
            type="number"
            value={l.ordem}
            onChange={(e) => set("ordem", parseInt(e.target.value) || 0)}
          />
        </Field>

        <div className="flex items-center gap-6 sm:col-span-2 pt-2">
          <Toggle checked={l.ativo} onChange={(v) => set("ativo", v)} label="Ativo no site" />
          <Toggle checked={l.destaque} onChange={(v) => set("destaque", v)} label="Em destaque" />
        </div>
      </div>
    </AdminModal>
  );
}
