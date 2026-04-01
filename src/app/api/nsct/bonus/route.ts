import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { NSCT_BONUS_QUESTIONS } from "@/lib/nsct";
import type { QuizQuestion } from "@/lib/quiz";

interface RawBonusQuestion {
  question?: unknown;
  options?: unknown;
  correctIndex?: unknown;
  explanation?: unknown;
  difficulty?: unknown;
}

const DEFAULT_MODEL = "openai/gpt-oss-120b";

const BONUS_PROMPT = `Generate exactly ${NSCT_BONUS_QUESTIONS} NSCT-style MCQs.
Return ONLY valid JSON as an array (no markdown, no extra text).
Each array item must follow this schema:
{
  "question": "string",
  "options": ["A option", "B option", "C option", "D option"],
  "correctIndex": 0,
  "explanation": "short explanation",
  "difficulty": "easy|medium|hard"
}
Rules:
- Provide exactly 4 options for every question.
- correctIndex must be an integer 0-3.
- Questions should be from computer science topics (DSA, OS, DB, Networks, Programming, Web, Cyber Security, AI/ML, Software Engineering, Problem Solving).
- Avoid duplicate questions.
- Keep language concise and exam-ready.`;

function resolveGroqConfig(): { apiKey?: string; model: string } {
  const modelEnv = process.env.GROQ_AI_MODEL?.trim();
  const apiKeyFromModel = modelEnv?.startsWith("gsk_") ? modelEnv : undefined;

  return {
    apiKey: process.env.GROQ_API_KEY?.trim() || apiKeyFromModel,
    model: modelEnv && !modelEnv.startsWith("gsk_") ? modelEnv : DEFAULT_MODEL,
  };
}

function extractArrayFromText(text: string): unknown[] {
  const trimmed = text.trim();
  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start < 0 || end <= start) return [];

  const candidate = trimmed.slice(start, end + 1);
  try {
    const parsed = JSON.parse(candidate);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? "").trim()).filter(Boolean);
}

function sanitizeQuestions(raw: unknown[]): QuizQuestion[] {
  const out: QuizQuestion[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const q = item as RawBonusQuestion;

    const question = String(q.question ?? "").trim();
    const options = toStringArray(q.options);
    const parsedCorrect = Number.parseInt(String(q.correctIndex ?? "0"), 10);
    const correctIndex = Number.isFinite(parsedCorrect) ? parsedCorrect : 0;

    if (!question) continue;
    if (options.length !== 4) continue;
    if (correctIndex < 0 || correctIndex > 3) continue;

    out.push({
      id: out.length + 1,
      question,
      options,
      correctIndex,
      explanation: String(q.explanation ?? "").trim() || undefined,
      difficulty: String(q.difficulty ?? "").trim() || undefined,
    });
  }

  return out;
}

export async function POST() {
  try {
    const { apiKey, model } = resolveGroqConfig();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY (or GROQ_AI_MODEL with gsk_ key)." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model,
      temperature: 1,
      top_p: 1,
      max_completion_tokens: 8192,
      messages: [
        {
          role: "user",
          content: BONUS_PROMPT,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    const text = Array.isArray(content)
      ? content
          .map((part) => (typeof part === "string" ? part : part.type === "text" ? part.text : ""))
          .join("")
      : String(content);

    const parsed = extractArrayFromText(text);
    const questions = sanitizeQuestions(parsed).slice(0, NSCT_BONUS_QUESTIONS);

    if (questions.length < NSCT_BONUS_QUESTIONS) {
      return NextResponse.json(
        { error: "AI returned insufficient valid bonus questions." },
        { status: 502 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate bonus questions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
