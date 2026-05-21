// Helpers para o botão de Contato Rápido (CTA) configurável por anunciante.
import type { CtaTipo, Local, StatusContrato } from "@/data/types";

export const CTA_OPTIONS: { value: CtaTipo; label: string; defaultText: string; defaultMsg: (nome: string) => string }[] = [
  { value: "whatsapp", label: "Falar no WhatsApp", defaultText: "Falar no WhatsApp", defaultMsg: (n) => `Olá! Vi ${n} no Turistei Urubici e gostaria de mais informações.` },
  { value: "reserva", label: "Reservar agora", defaultText: "Reservar agora", defaultMsg: (n) => `Olá! Quero reservar em ${n}. Pode me ajudar?` },
  { value: "orcamento", label: "Solicitar orçamento", defaultText: "Solicitar orçamento", defaultMsg: (n) => `Olá! Gostaria de um orçamento de ${n}.` },
  { value: "disponibilidade", label: "Ver disponibilidade", defaultText: "Ver disponibilidade", defaultMsg: (n) => `Olá! Quero saber a disponibilidade em ${n}.` },
  { value: "agendamento", label: "Agendar atendimento", defaultText: "Agendar atendimento", defaultMsg: (n) => `Olá! Quero agendar um atendimento em ${n}.` },
];

export function getCtaConfig(local: Local) {
  const tipo: CtaTipo = local.ctaTipo ?? "whatsapp";
  const preset = CTA_OPTIONS.find((o) => o.value === tipo) ?? CTA_OPTIONS[0];
  const texto = local.ctaTexto?.trim() || preset.defaultText;
  const mensagem = local.ctaMensagem?.trim() || preset.defaultMsg(local.nome);
  return { tipo, texto, mensagem };
}

export function ctaWhatsappUrl(local: Local, fallbackWhats?: string) {
  const numero = (local.whatsapp || fallbackWhats || "").replace(/\D/g, "");
  if (!numero) return null;
  const { mensagem } = getCtaConfig(local);
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

// ---- Contrato / status ----

const OFFLINE: StatusContrato[] = ["vencido", "suspenso", "cancelado"];

/** Status efetivo: se contrato venceu, força "vencido". */
export function effectiveStatus(local: Local): StatusContrato {
  const s = local.statusContrato ?? "ativo";
  if (s === "ativo" && local.validadeContrato) {
    const hoje = new Date().toISOString().slice(0, 10);
    if (local.validadeContrato < hoje) return "vencido";
  }
  return s;
}

/** Regra única para listagens públicas: ativo no admin + contrato não-offline. */
export function isLocalPublico(local: Local): boolean {
  if (!local.ativo) return false;
  return !OFFLINE.includes(effectiveStatus(local));
}

export const STATUS_LABEL: Record<StatusContrato, string> = {
  ativo: "Ativo",
  pendente: "Pendente",
  vencido: "Vencido",
  suspenso: "Suspenso",
  cancelado: "Cancelado",
};

export const STATUS_TONE: Record<StatusContrato, string> = {
  ativo: "bg-primary/10 text-primary",
  pendente: "bg-gold/20 text-gold-foreground",
  vencido: "bg-destructive/10 text-destructive",
  suspenso: "bg-muted text-muted-foreground",
  cancelado: "bg-destructive/15 text-destructive",
};
