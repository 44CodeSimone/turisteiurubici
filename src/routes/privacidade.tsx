import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacidade")({
  component: Privacidade,
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Turistei Urubici" },
      { name: "description", content: "Como coletamos, usamos e protegemos os dados na plataforma Turistei Urubici." },
    ],
  }),
});

function Privacidade() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 md:px-6 py-12 md:py-20 flex-1">
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Política de Privacidade</h1>
        <p className="mt-3 text-sm text-muted-foreground">Última atualização: maio de 2026</p>

        <div className="prose prose-sm mt-8 max-w-none text-foreground/90 space-y-5 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold">1. Sobre esta política</h2>
            <p>O Turistei Urubici respeita sua privacidade e segue a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">2. Dados que coletamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Login:</strong> e-mail e senha de administradores e empresas cadastradas.</li>
              <li><strong>Contato:</strong> mensagens enviadas via WhatsApp ou formulários (quando o usuário inicia o contato).</li>
              <li><strong>IA Elza:</strong> mensagens trocadas com nossa assistente para responder dúvidas turísticas.</li>
              <li><strong>Cookies essenciais:</strong> usados apenas para manter sua sessão e preferências.</li>
            </ul>
            <p>Não coletamos dados sensíveis e não vendemos suas informações.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">3. Uso dos dados</h2>
            <p>Utilizamos os dados para autenticação, melhorar a experiência, responder dúvidas e divulgar negócios cadastrados.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">4. Seus direitos</h2>
            <p>Você pode solicitar acesso, correção ou exclusão dos seus dados pelo e-mail informado em contato.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">5. Contato</h2>
            <p>Dúvidas? Fale conosco pelos canais oficiais do Turistei Urubici.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
