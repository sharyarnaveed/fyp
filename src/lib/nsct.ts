import type { QuizQuestion } from "@/lib/quiz";

export const NSCT_BASE_QUESTIONS = 70;
export const NSCT_BONUS_QUESTIONS = 30;
export const NSCT_TOTAL_QUESTIONS = NSCT_BASE_QUESTIONS + NSCT_BONUS_QUESTIONS;
export const NSCT_AI_START_AT_QUESTION = 40;
export const NSCT_PER_FILE = 8;
export const NSCT_DURATION_MINUTES = 60;
export const NSCT_QUESTIONS_KEY = "prepzy_nsct_questions";
export const NSCT_ANSWERS_KEY = "prepzy_nsct_answers";
export const NSCT_END_AT_KEY = "prepzy_nsct_end_at";
export const NSCT_SCORE_KEY = "prepzy_nsct_score";

const NSCT_FILES = [
  "Ai-Ml-Learning_&_Data-Analytics.from_pdf.json",
  "Computer-Networks_&_Cloud-Computing.from_pdf.json",
  "Cyber-Security.from_pdf.json",
  "Databases.from_pdf.json",
  "DSA.from_pdf.json",
  "Operating-Systems.from_pdf.json",
  "Problem_Solving.from_pdf.json",
  "Programming.from_pdf.json",
  "Software-Engineering.from_pdf.json",
  "Web-Development.from_pdf.json",
] as const;

interface RawOption {
  label?: string;
  text?: string;
}

interface RawNsctQuestion {
  id?: number;
  question?: string;
  options?: RawOption[] | string[];
  correct_answer?: string;
  explanation?: string;
  difficulty?: string;
  subject?: string;
}

function shuffle<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function normalizeOptions(options: RawNsctQuestion["options"]): string[] {
  if (!Array.isArray(options) || options.length === 0) return [];

  if (typeof options[0] === "string") {
    return (options as string[]).map((value) => String(value).trim()).filter(Boolean);
  }

  const ordered = [...(options as RawOption[])].sort((a, b) => {
    const aLabel = (a.label ?? "").toUpperCase();
    const bLabel = (b.label ?? "").toUpperCase();
    return aLabel.localeCompare(bLabel);
  });

  return ordered.map((opt) => String(opt.text ?? "").trim()).filter(Boolean);
}

function resolveCorrectIndex(correctAnswer: string | undefined, options: string[]): number {
  if (!correctAnswer) return 0;

  const answer = correctAnswer.trim();
  const letter = answer.toUpperCase().match(/^([A-D])$/);
  if (letter) {
    const index = ["A", "B", "C", "D"].indexOf(letter[1]);
    if (index >= 0 && index < options.length) return index;
  }

  const byText = options.findIndex((option) => option.toLowerCase() === answer.toLowerCase());
  if (byText >= 0) return byText;

  return 0;
}

function toQuizQuestion(raw: RawNsctQuestion, id: number): QuizQuestion | null {
  const question = String(raw.question ?? "").trim();
  const options = normalizeOptions(raw.options);
  if (!question || options.length < 2) return null;

  const correctIndex = resolveCorrectIndex(raw.correct_answer, options);
  return {
    id,
    question,
    options,
    correctIndex,
    explanation: raw.explanation,
    difficulty: raw.difficulty,
  };
}

function toPublicPath(fileName: string): string {
  return encodeURI(`/national test/${fileName}`);
}

async function loadFileQuestions(fileName: string): Promise<QuizQuestion[]> {
  const response = await fetch(toPublicPath(fileName), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${fileName}`);
  }

  const raw = (await response.json()) as RawNsctQuestion[];
  if (!Array.isArray(raw)) {
    throw new Error(`Invalid NSCT file format: ${fileName}`);
  }

  let nextId = 1;
  return raw
    .map((item) => toQuizQuestion(item, nextId++))
    .filter((item): item is QuizQuestion => item !== null);
}

export async function generateNsctQuestionSet(): Promise<QuizQuestion[]> {
  const loadedByFile = await Promise.all(
    NSCT_FILES.map(async (fileName) => ({
      fileName,
      questions: await loadFileQuestions(fileName),
    }))
  );

  const bucket: QuizQuestion[] = [];
  for (const source of loadedByFile) {
    if (source.questions.length < NSCT_PER_FILE) {
      throw new Error(`Not enough questions in ${source.fileName}`);
    }

    const selected = shuffle(source.questions).slice(0, NSCT_PER_FILE);
    bucket.push(...selected);
  }

  const finalSet = shuffle(bucket).slice(0, NSCT_BASE_QUESTIONS);
  return finalSet.map((question, index) => ({ ...question, id: index + 1 }));
}

export function formatNsctTimer(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function clearNsctAttemptStorage(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(NSCT_QUESTIONS_KEY);
    sessionStorage.removeItem(NSCT_ANSWERS_KEY);
    sessionStorage.removeItem(NSCT_END_AT_KEY);
    sessionStorage.removeItem(NSCT_SCORE_KEY);
  } catch {
    // ignore
  }
}
