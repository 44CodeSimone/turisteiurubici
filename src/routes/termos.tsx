import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/termos")({
  component: Termos,
  head: () => ({
    meta: [
      { title: "Termos de Uso — Turistei Urubici" },
      { name: "description", content: "Termos de uso da plataforma Turistei Urubici." },
    ],
  }),
});

function Termos() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 md:px-6 py-12 md:py-20 flex-1">
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Termos de Uso</h1>
        <p className="mt-3 text-sm text-muted-foreground">Última atualização: maio de 2026</p>

        <div className="prose prose-sm mt-8 max-w-none text-foreground/90 space-y-5 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold">1. Aceitação</h2>
            <p>Ao usar o Turistei Urubici você concorda com estes termos. Se discordar, não utilize a plataforma.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">2. Conteúdo</h2>
            <p>Atuamos como guia digital. Informações de pontos turísticos, hospedagens, gastronomia e serviços são curadas, mas podem mudar — confirme detalhes diretamente com o estabelecimento.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">3. Reservas e preços</h2>
            <p>O Turistei Urubici não realiza reservas nem confirma preços. As negociações ocorrem diretamente entre usuário e estabelecimento.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">4. IA Elza</h2>
            <p>A Elza é uma assistente turística que oferece sugestões e informações gerais. Suas respostas não substituem confirmação oficial.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">5. Responsabilidades</h2>
            <p>Trilhas, cachoeiras e atividades ao ar livre exigem cuidado pessoal. O usuário é responsável pelas próprias escolhas e segurança.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">6. Alterações</h2>
            <p>Podemos atualizar estes termos. Mudanças relevantes serão comunicadas no site.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
