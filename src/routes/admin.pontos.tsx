import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/pontos")({
  component: () => <Placeholder titulo="Pontos turísticos" />,
});

function Placeholder({ titulo }: { titulo: string }) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">{titulo}</h1>
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-muted-foreground">
          Em breve: gestão completa de {titulo.toLowerCase()} com cadastro, edição,
          coordenadas, imagens e destaque.
        </p>
      </div>
    </div>
  );
}
