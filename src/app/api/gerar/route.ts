import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const requestSchema = z.object({
  cenario: z.enum([
    "No restaurante", "Chegando no trabalho", "Saindo do trabalho",
    "Pedindo informação", "Na cafeteria", "No supermercado",
    "No aeroporto", "Cenário aleatório"
  ]),
  nivel: z.enum(["simples", "medio"]),
  palavrasRecorrentes: z.array(z.string().trim().min(1).max(40)).max(5).default([])
});

const palavraSchema = z.object({
  texto: z.string(),
  traducao: z.string(),
  repetida: z.boolean()
});

const quadroSchema = z.object({
  numero: z.number().int().min(1).max(4),
  personagem: z.string(),
  papel: z.enum(["personagem_a", "personagem_b"]),
  frase_completa_en: z.string(),
  traducao_livre_pt: z.string(),
  palavras: z.array(palavraSchema).min(1)
});

const tirinhaSchema = z.object({
  cenario: z.string(),
  nivel: z.enum(["simples", "medio"]),
  palavras_chave_novas: z.array(z.string()).min(3).max(5),
  quadros: z.array(quadroSchema).length(4)
});

const tirinhaJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["cenario", "nivel", "palavras_chave_novas", "quadros"],
  properties: {
    cenario: { type: "string" },
    nivel: { type: "string", enum: ["simples", "medio"] },
    palavras_chave_novas: { type: "array", items: { type: "string" } },
    quadros: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["numero", "personagem", "papel", "frase_completa_en", "traducao_livre_pt", "palavras"],
        properties: {
          numero: { type: "integer" },
          personagem: { type: "string" },
          papel: { type: "string", enum: ["personagem_a", "personagem_b"] },
          frase_completa_en: { type: "string" },
          traducao_livre_pt: { type: "string" },
          palavras: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["texto", "traducao", "repetida"],
              properties: {
                texto: { type: "string" },
                traducao: { type: "string" },
                repetida: { type: "boolean" }
              }
            }
          }
        }
      }
    }
  }
} as const;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "A variável OPENAI_API_KEY não foi configurada no servidor." },
        { status: 500 }
      );
    }

    const body: unknown = await request.json();
    const parsedRequest = requestSchema.safeParse(body);
    if (!parsedRequest.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: parsedRequest.error.flatten() },
        { status: 400 }
      );
    }

    const { cenario, nivel, palavrasRecorrentes } = parsedRequest.data;
    const levelInstructions = nivel === "simples"
      ? "Use inglês iniciante A1-A2: frases curtas, presente simples, vocabulário essencial e construções diretas. Evite estruturas gramaticais complexas."
      : "Use inglês A2-B1: frases naturais, misture presente, passado e futuro quando fizer sentido, inclua expressões idiomáticas comuns e phrasal verbs básicos. Mantenha o diálogo fácil de entender.";

    const recurringInstruction = palavrasRecorrentes.length
      ? `PALAVRAS QUE PRECISAM SER RECICLADAS NESTA TIRINHA: ${palavrasRecorrentes.join(", ")}.
Use todas essas palavras exatamente como palavras em inglês dentro das falas, de forma natural e contextualizada. Na lista "palavras", marque repetida=true em cada token que corresponda a uma dessas palavras (ignorando maiúsculas/minúsculas e pontuação). Não marque outras palavras como repetidas.`
      : "Ainda não há vocabulário anterior. Marque repetida=false em todas as palavras.";

    const instructions = `Você é um professor de inglês especializado em diálogos cotidianos para falantes brasileiros.
Crie uma tirinha didática com EXATAMENTE 4 quadros em sequência, com começo, desenvolvimento e conclusão.
CENÁRIO: ${cenario}.
NÍVEL: ${nivel}.
${levelInstructions}
${recurringInstruction}

Regras obrigatórias:
1. Use dois personagens consistentes, alternando as falas entre personagem_a e personagem_b.
2. Cada quadro contém uma única fala curta e natural, em inglês americano.
3. "palavras" deve dividir frase_completa_en em tokens na ordem original. Preserve pontuação junto ao token correspondente. Cada token precisa de uma tradução contextual curta em português. Contrações podem permanecer como um token.
4. A tradução deve refletir o sentido daquela frase, não uma tradução isolada de dicionário. Exemplo: "bill" em restaurante = "conta".
5. "palavras_chave_novas" deve conter de 3 a 5 palavras úteis presentes nas falas, excluindo as palavras recorrentes enviadas.
6. Retorne somente os dados no formato JSON solicitado.`;

    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions,
      input: "Gere a tirinha agora. Responda em português nas traduções e em inglês americano nas falas.",
      temperature: 0.75,
      max_output_tokens: 3000,
      text: {
        format: {
          type: "json_schema",
          name: "tirinha_ingles",
          strict: true,
          schema: tirinhaJsonSchema
        }
      }
    });

    if (!response.output_text) {
      return NextResponse.json(
        { error: "A IA não retornou conteúdo. Tente novamente." },
        { status: 502 }
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(response.output_text);
    } catch {
      console.error("OpenAI retornou conteúdo que não pôde ser interpretado como JSON.");
      return NextResponse.json(
        { error: "Não foi possível interpretar a resposta da IA." },
        { status: 502 }
      );
    }

    const validated = tirinhaSchema.safeParse(json);
    if (!validated.success) {
      console.error("Formato inesperado da OpenAI:", validated.error.flatten());
      return NextResponse.json(
        { error: "A IA retornou uma tirinha fora do formato esperado. Tente novamente." },
        { status: 502 }
      );
    }

    const recurringSet = new Set(palavrasRecorrentes.map((word) => word.toLowerCase()));
    const normalized = {
      ...validated.data,
      cenario,
      nivel,
      quadros: validated.data.quadros
        .sort((a, b) => a.numero - b.numero)
        .map((quadro, index) => ({
          ...quadro,
          numero: index + 1,
          palavras: quadro.palavras.map((word) => {
            const clean = word.texto.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/gi, "");
            return { ...word, repetida: recurringSet.has(clean) };
          })
        }))
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Erro ao gerar tirinha com OpenAI:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao gerar a tirinha. Verifique sua conexão e tente novamente." },
      { status: 500 }
    );
  }
}
