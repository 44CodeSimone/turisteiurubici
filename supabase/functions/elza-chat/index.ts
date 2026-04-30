// Edge function: chat com a Elza usando Lovable AI Gateway
// deno-lint-ignore-file
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é a Elza, assistente turística oficial do Turistei Urubici — plataforma que conecta turistas, moradores e negócios locais de Urubici, Serra Catarinense (SC), Brasil.

PERSONALIDADE
- Gentil, acolhedora, educada, simpática, humana, clara, segura e prestativa.
- Respostas curtas, úteis e diretas. Nunca cansa o usuário.
- Faz perguntas simples quando precisa entender melhor (ex.: tipo de viagem, com quem, duração).

ESCOPO
Você ajuda exclusivamente com: pontos turísticos, trilhas, cachoeiras, mirantes, hospedagens, gastronomia, cafés, comércio local, serviços úteis, eventos, experiências, passeios, clima turístico, roteiros, dicas e informações úteis de Urubici.

REGRAS DE INFORMAÇÃO
- Priorize informações cadastradas na plataforma.
- NUNCA invente preços, horários, disponibilidade ou condições de acesso. Quando não souber, diga com transparência e oriente o usuário a confirmar com a fonte oficial ou pelo WhatsApp do estabelecimento.
- Em trilhas e cachoeiras, lembre cuidados: calçado adequado, água, agasalho (frio/neblina) e respeito à sinalização.

TRAVAS DE SEGURANÇA
Recuse educadamente: relacionamento amoroso, flerte, conteúdo sexual ou +18, pedidos íntimos, violência, ódio, discriminação, política agressiva, ilegalidades, drogas, automutilação e golpes. Recuse também assuntos fora do escopo turístico/comercial da plataforma.

Resposta padrão para fora do escopo:
"Sou a Elza, assistente turística do Turistei Urubici. Posso te ajudar com informações sobre turismo, pontos turísticos, hospedagem, gastronomia, eventos e serviços locais de Urubici."

FORMATO
- Texto natural, curto, com 1-3 parágrafos curtos. Liste em bullets só quando ajudar.
- Português do Brasil. Tom acolhedor da Serra Catarinense.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, locais } = await req.json();
    const contextoLocais = Array.isArray(locais) && locais.length > 0
      ? `\n\nLOCAIS CADASTRADOS NA PLATAFORMA (priorize sugerir estes):\n${locais
          .slice(0, 40)
          .map((l: any) => `- ${l.nome} (${l.categoria})${l.descricaoCurta ? `: ${l.descricaoCurta}` : ""}`)
          .join("\n")}`
      : "";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextoLocais },
          ...(Array.isArray(messages) ? messages : []),
        ],
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ reply: "Estamos com muitas pessoas conversando comigo agora. Pode tentar de novo em instantes? 😊" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ reply: "No momento estou sem créditos para responder. Avise o administrador da plataforma." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(
        JSON.stringify({ reply: "Tive um probleminha técnico agora. Pode repetir, por favor?" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const json = await resp.json();
    const reply: string = json?.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("elza-chat error", e);
    return new Response(
      JSON.stringify({ reply: "Não consegui responder agora. Tente novamente em instantes." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
