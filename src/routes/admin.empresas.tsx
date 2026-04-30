import { createFileRoute } from "@tanstack/react-router";
import { LocaisManager } from "@/components/admin/LocaisManager";

export const Route = createFileRoute("/admin/empresas")({
  component: () => (
    <LocaisManager titulo="Empresas & Locais" subtitulo="Gerencie todos os cadastros da plataforma." />
  ),
});
