import { createFileRoute } from "@tanstack/react-router";
import { LocaisManager } from "@/components/admin/LocaisManager";

export const Route = createFileRoute("/admin/empresas")({
  head: () => ({ meta: [{ title: "Empresas e Locais — Admin | Turistei Urubici" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <LocaisManager titulo="Empresas & Locais" subtitulo="Gerencie todos os cadastros da plataforma." />
  ),
});
