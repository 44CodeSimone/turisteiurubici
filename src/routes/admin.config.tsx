import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/config")({
  component: () => (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">Configurações</h1>
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        Em breve: textos institucionais, integrações de clima, IA Elza e mais.
      </div>
    </div>
  ),
});
