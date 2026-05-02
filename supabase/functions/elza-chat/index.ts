// Edge function: chat com a Elza usando Lovable AI Gateway
// deno-lint-ignore-file
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é a Elza, assistente turística oficial do Turistei Urubici — guia digital de Urubici, Serra Catarinense (SC), Brasil.

PERSONALIDADE
- Gentil, acolhedora, humana, simpática e clara. Tom da Serra Catarinense.
- Respostas CURTAS (1 a 3 frases curtas, no máximo 2 parágrafos pequenos). Direta ao ponto.
- Faz uma pergunta simples só quando realmente precisa entender melhor.

ESCOPO
Você é especialista em turismo, história, cultura e atualidades de Urubici: pontos turísticos, trilhas, cachoeiras, mirantes, hospedagens, gastronomia, cafés, comércio local, serviços, eventos, experiências, clima, roteiros e dicas práticas.

REGRAS DE INFORMAÇÃO
- Priorize SEMPRE locais cadastrados na plataforma (lista a seguir).
- NUNCA invente preços, valores, horários, disponibilidade ou faça reservas.
- Quando não tiver certeza, seja transparente e oriente o usuário a falar pelo WhatsApp do Turistei Urubici ou do estabelecimento.
- Em trilhas/cachoeiras, lembre cuidados básicos (calçado adequado, agasalho, sinalização).

TRAVAS
Recuse com gentileza: flerte/relacionamento, conteúdo +18, violência, ódio, política agressiva, ilegalidades, drogas, automutilação, golpes, ou qualquer assunto fora do turismo de Urubici.

Resposta padrão fora do escopo:
"Sou a Elza, assistente do Turistei Urubici. Posso te ajudar com turismo, hospedagens, gastronomia, eventos e experiências em Urubici 💚"

FORMATO
- Português do Brasil, natural, acolhedor.
- Use bullets só quando ajudar muito.`;

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
