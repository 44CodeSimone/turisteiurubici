import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/eventos")({
  component: () => (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">Eventos</h1>
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        Em breve: agenda de eventos com banners, datas e destaque na home.
      </div>
    </div>
  ),
});
