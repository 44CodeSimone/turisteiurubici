import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/banners")({
  component: () => (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">Banners</h1>
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        Em breve: upload, ordenação e período de exibição de banners promocionais.
      </div>
    </div>
  ),
});
