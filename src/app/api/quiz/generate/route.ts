import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

interface GenerateRequestBody {
  passage?: unknown;
  num_questions?: unknown;
}

function resolveGroqConfig(): { primaryApiKey?: string; backupApiKey?: string; model: string } {
  const modelEnv = process.env.GROQ_AI_MODEL?.trim();
  const apiKeyFromModel = modelEnv?.startsWith("gsk_") ? modelEnv : undefined;

  return {
    primaryApiKey: process.env.GROQ_API_KEY?.trim() || apiKeyFromModel,
    backupApiKey: process.env.GROQ_BACKUP_KEY?.trim(),
    model: modelEnv && !modelEnv.startsWith("gsk_") ? modelEnv : DEFAULT_MODEL,
  };
}

function extractTextContent(content: unknown): string {
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "type" in part && "text" in part) {
          const typed = part as { type?: string; text?: string };
          return typed.type === "text" ? typed.text ?? "" : "";
        }
        return "";
      })
      .join("");
  }
  return typeof content === "string" ? content : String(content ?? "");
}

function buildPrompt(passage: string, questionCount: number): string {
  return `Create exactly ${questionCount} MCQs from the given passage.
Return ONLY valid JSON as an array (no markdown, no extra text).
Each item must follow this schema:
{
  "question": "string",
  "options": {
    "A": "string",
    "B": "string",
    "C": "string",
    "D": "string"
  },
  "correct_answer": "A",
  "difficulty": "easy|medium|hard",
  "explanation": "short explanation"
}
Rules:
- Keep questions strictly based on passage content.
- Provide exactly 4 options (A-D) for every question.
- correct_answer must be one of A, B, C, D.
- Avoid duplicates.

Passage:
${passage}`;
}

async function generateWithGroq(apiKey: string, model: string, prompt: string): Promise<string> {
  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    model,
    temperature: 1,
    top_p: 1,
    max_completion_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  return extractTextContent(completion.choices?.[0]?.message?.content).trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateRequestBody;
    const passage = typeof body.passage === "string" ? body.passage.trim() : "";
    const requestedCount = Number.parseInt(String(body.num_questions ?? 10), 10);
    const questionCount = Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : 10;

    if (!passage) {
      return NextResponse.json({ error: "Missing passage" }, { status: 400 });
    }

    const { primaryApiKey, backupApiKey, model } = resolveGroqConfig();
    const candidateKeys = [primaryApiKey, backupApiKey].filter(
      (value, index, array): value is string => Boolean(value) && array.indexOf(value) === index
    );

    if (candidateKeys.length === 0) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY/GROQ_BACKUP_KEY" },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(passage, questionCount);
    const attemptErrors: string[] = [];

    for (const [attemptIndex, key] of candidateKeys.entries()) {
      try {
        const raw = await generateWithGroq(key, model, prompt);
        if (raw) {
          return NextResponse.json({ raw });
        }
        attemptErrors.push(`Attempt ${attemptIndex + 1}: empty response.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Groq error.";
        attemptErrors.push(`Attempt ${attemptIndex + 1}: ${message}`);
      }
    }

    return NextResponse.json(
      { error: `Groq failed for all configured keys. ${attemptErrors.join(" ")}` },
      { status: 502 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
