import { createFileRoute } from "@tanstack/react-router";
import { LocaisManager } from "@/components/admin/LocaisManager";

export const Route = createFileRoute("/admin/pontos")({
  component: () => (
    <LocaisManager
      titulo="Pontos turísticos"
      subtitulo="Trilhas, cachoeiras, mirantes e atrações naturais de Urubici."
      fixedCategoria="pontos-turisticos"
    />
  ),
});
