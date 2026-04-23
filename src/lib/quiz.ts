const GENERATE_API = "/api/quiz/generate";

import supabase from "@/lib/SupabaseClient";

/** Default passage used for the trial quiz (decided by us). */
export const TRIAL_QUIZ_PASSAGE = `Chemical kinetics is the branch of chemistry that deals with the study of the rates of chemical reactions, the factors affecting these rates, and the mechanisms by which reactions occur. Chemical reactions are dynamic processes in which matter and energy are continuously transformed. Some reactions are extremely fast, such as acid–base neutralization, which may occur in microseconds. Others are very slow, like fermentation, which can take weeks to produce noticeable amounts of product. Many biological reactions, including muscle contraction and nerve impulse transmission, occur at moderate speeds. In industry, understanding reaction rates is essential to determine the most economical and efficient conditions for large-scale production. The rate of a reaction is defined as the change in concentration of reactants or products per unit time. Mathematically, it is expressed as: Rate = Change in concentration / Time taken Since concentration is measured in mole dm⁻³ and time in seconds, the unit of rate is mole dm⁻³ s⁻¹. As a reaction proceeds, the concentration of reactants decreases while that of products increases. Therefore, the rate can be expressed either as the decrease in concentration of reactants or the increase in concentration of products. For a general reaction A → B, the rate is written as: Rate = −d[A]/dt = +d[B]/dt The negative sign indicates the decrease in reactant concentration, while the positive sign represents the increase in product concentration. The rate measured over a time interval is called the average rate, while the rate at a specific instant is known as the instantaneous rate. The instantaneous rate is determined from the slope of the tangent drawn to the concentration–time graph at that point. When the time interval becomes very small, the average rate approaches the instantaneous rate. To determine how concentration affects reaction rate, chemists often measure the initial rate, which is the instantaneous rate at the moment reactants are mixed (t = 0). At this stage, complications such as reverse reactions are minimal. The slope of the tangent at zero time gives the initial rate. Experimental observations show that the rate of a reaction depends on the concentration of reactants raised to certain powers. This relationship is called the rate law. For a simple reaction A → Products: Rate = k[A]ˣ Here, k is the rate constant, and x is the order of reaction with respect to A.`;

/** Raw question shape from API (inside response.raw JSON string) */
export interface ApiQuestion {
  question: string;
  options: Record<string, string> | string[]; // { A: "...", B: "..." } OR ["opt1", "opt2", ...]
  correct_answer: string; // "A" | "B" | "C" | "D" or full answer text
  difficulty?: string;
  explanation?: string;
}

/** API response: { raw: "[\n  { ... }, ... ]" } */
export interface GenerateResponse {
  raw: string;
}

/** Normalized question for the quiz UI */
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[]; // ordered [A, B, C, D]
  correctIndex: number; // 0-based index into options
  explanation?: string;
  difficulty?: string;
}

const OPTION_ORDER = ["A", "B", "C", "D"];

function stripReasoningBlocks(raw: string): string {
  return raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

function extractObjectsFromPossiblyTruncatedArray(raw: string): unknown[] {
  const start = raw.indexOf("[");
  if (start === -1) return [];

  const slice = raw.slice(start);
  const parsedItems: unknown[] = [];
  let inString = false;
  let escaped = false;
  let arrayDepth = 0;
  let objectDepth = 0;
  let objectStart = -1;

  for (let index = 0; index < slice.length; index += 1) {
    const char = slice[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "[") {
      arrayDepth += 1;
      continue;
    }

    if (char === "]") {
      if (arrayDepth > 0) arrayDepth -= 1;
      continue;
    }

    if (arrayDepth === 0) continue;

    if (char === "{") {
      if (objectDepth === 0) objectStart = index;
      objectDepth += 1;
      continue;
    }

    if (char === "}" && objectDepth > 0) {
      objectDepth -= 1;
      if (objectDepth === 0 && objectStart !== -1) {
        const maybeObject = slice.slice(objectStart, index + 1);
        try {
          parsedItems.push(JSON.parse(maybeObject));
        } catch {
          // Skip malformed object and continue.
        }
        objectStart = -1;
      }
    }
  }

  return parsedItems;
}

function extractJsonArrayFromText(raw: string): unknown[] {
  const trimmed = stripReasoningBlocks(raw).trim();
  if (!trimmed) return [];

  try {
    const direct = JSON.parse(trimmed);
    return extractMcqsFromPayload(direct);
  } catch {
    // Try fenced and sliced parsing below.
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const maybeJson = fenced?.[1] ?? trimmed;
  const start = maybeJson.indexOf("[");
  const end = maybeJson.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) return [];

  const slice = maybeJson.slice(start, end + 1);
  try {
    const parsed = JSON.parse(slice);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return extractObjectsFromPossiblyTruncatedArray(maybeJson);
  }
}

function extractMcqsFromPayload(payload: unknown): unknown[] {
  if (typeof payload === "string") {
    return extractJsonArrayFromText(payload);
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const directCandidates = [
    record.mcqs,
    record.questions,
    record.data,
    record.result,
    record.items,
    record.output,
    record.response,
    record.results,
    record.raw,
  ];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate;

    if (typeof candidate === "string") {
      const parsedFromString = extractJsonArrayFromText(candidate);
      if (parsedFromString.length > 0) return parsedFromString;
    }

    if (candidate && typeof candidate === "object") {
      const nested = extractMcqsFromPayload(candidate);
      if (nested.length > 0) return nested;
    }
  }

  for (const value of Object.values(record)) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      const parsedFromString = extractJsonArrayFromText(value);
      if (parsedFromString.length > 0) return parsedFromString;
    }
    if (value && typeof value === "object") {
      const nested = extractMcqsFromPayload(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

/** Resolve options from either Record<string, string> or string[] to ordered string[] */
function resolveOptions(options: Record<string, string> | string[] | undefined | null): string[] {
  if (!options) return [];

  // If it's already an array of strings
  if (Array.isArray(options)) {
    return options.map((o) => (typeof o === "string" ? o : String(o))).filter(Boolean);
  }

  // It's a Record — try ordered keys first
  if (typeof options === "object") {
    const fromKeys = OPTION_ORDER.map((key) => options[key] ?? options[key.toLowerCase()] ?? "").filter(Boolean);
    if (fromKeys.length > 0) return fromKeys;
    // Fallback: just take all values in insertion order
    return Object.values(options).filter((v) => typeof v === "string" && v.length > 0);
  }

  return [];
}

/** Resolve the correct answer index from the API's correct_answer field */
function resolveCorrectIndex(correctAnswer: string | number | undefined, optionsArray: string[]): number {
  if (correctAnswer == null) return 0;

  // If it's a number already, use it as index
  if (typeof correctAnswer === "number") {
    return correctAnswer >= 0 && correctAnswer < optionsArray.length ? correctAnswer : 0;
  }

  const answer = String(correctAnswer).trim();

  // Single letter match: "A", "B", "C", "D" (case-insensitive)
  const letterMatch = answer.match(/^([A-Da-d])(?:[.):;\s]|$)/);
  if (letterMatch) {
    const idx = OPTION_ORDER.indexOf(letterMatch[1].toUpperCase());
    if (idx >= 0 && idx < optionsArray.length) return idx;
  }

  // Exact or prefix match against option text
  const lower = answer.toLowerCase();
  for (let i = 0; i < optionsArray.length; i++) {
    if (optionsArray[i].toLowerCase() === lower) return i;
  }
  for (let i = 0; i < optionsArray.length; i++) {
    if (optionsArray[i].toLowerCase().startsWith(lower) || lower.startsWith(optionsArray[i].toLowerCase())) return i;
  }

  // Fallback: try to parse as index
  const numIdx = parseInt(answer, 10);
  if (Number.isFinite(numIdx) && numIdx >= 0 && numIdx < optionsArray.length) return numIdx;

  return 0;
}

/** Parse API raw string and convert to QuizQuestion[] */
export function parseGenerateRaw(raw: string): QuizQuestion[] {
  const parsed = extractMcqsFromPayload(raw) as ApiQuestion[];
  if (parsed.length === 0) return [];

  return parsed
    .filter((q) => q && typeof q === "object" && q.question)
    .map((q, index) => {
      const optionsArray = resolveOptions(q.options);
      const correctIndex = resolveCorrectIndex(q.correct_answer, optionsArray);
      const correctLabel = OPTION_ORDER[correctIndex] ?? "A";
      const correctText = optionsArray[correctIndex] ?? "";

      // Build explanation: use API-provided one, or generate a fallback
      let explanation = q.explanation;
      if (!explanation || !explanation.trim()) {
        explanation = `The correct answer is ${correctLabel}` + (correctText ? `: ${correctText}` : "");
      }

      return {
        id: index + 1,
        question: q.question ?? "",
        options: optionsArray.length >= 2 ? optionsArray : ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: correctIndex < optionsArray.length ? correctIndex : 0,
        explanation,
        difficulty: q.difficulty,
      };
    });
}

export function parseGeneratePayload(payload: unknown): QuizQuestion[] {
  const parsed = extractMcqsFromPayload(payload) as ApiQuestion[];
  if (parsed.length === 0) return [];

  return parsed
    .filter((q) => q && typeof q === "object" && q.question)
    .map((q, index) => {
      const optionsArray = resolveOptions(q.options);
      const correctIndex = resolveCorrectIndex((q as ApiQuestion).correct_answer, optionsArray);
      const correctLabel = OPTION_ORDER[correctIndex] ?? "A";
      const correctText = optionsArray[correctIndex] ?? "";

      let explanation = (q as ApiQuestion).explanation;
      if (!explanation || !explanation.trim()) {
        explanation = `The correct answer is ${correctLabel}` + (correctText ? `: ${correctText}` : "");
      }

      return {
        id: index + 1,
        question: (q as ApiQuestion).question ?? "",
        options: optionsArray.length >= 2 ? optionsArray : ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: correctIndex < optionsArray.length ? correctIndex : 0,
        explanation,
        difficulty: (q as ApiQuestion).difficulty,
      };
    });
}

export interface GenerateQuizInput {
  passage: string;
  num_questions: number;
}

/** Call generate API with POST only; returns normalized questions */
export async function generateQuiz(input: GenerateQuizInput): Promise<QuizQuestion[]> {
  const res = await fetch(GENERATE_API, {
    method: "POST", // API accepts POST only
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      passage: input.passage,
      num_questions: input.num_questions,
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as GenerateResponse | Record<string, unknown> | unknown[];
  const fromPayload = parseGeneratePayload(data);
  if (fromPayload.length > 0) return fromPayload;

  const raw =
    data && typeof data === "object" && !Array.isArray(data)
      ? String((data as GenerateResponse).raw ?? "")
      : "";
  return parseGenerateRaw(raw);
}

/** Retry a function up to `maxRetries` times with exponential backoff. */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, baseDelay * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

const STORAGE_KEY = "prepzy_quiz_questions";
const QUIZ_DATA_KEY = "prepzy_quiz_data";

export type QuizSubject = "biology" | "chemistry" | "physics";

const JSONL_PATHS: Record<QuizSubject, string> = {
  biology: "/mcqsjson/biology.jsonl",
  chemistry: "/mcqsjson/checmistry.jsonl",
  physics: "/mcqsjson/phytsics.jsonl",
};

/** Fetch JSONL from path, pick a random line, parse JSON and return obj.text. Returns null on error. */
export async function getRandomPassageFromJsonl(jsonlPath: string): Promise<string | null> {
  try {
    const res = await fetch(jsonlPath);
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;
    const line = lines[Math.floor(Math.random() * lines.length)];
    const obj = JSON.parse(line) as { text?: string };
    return typeof obj?.text === "string" ? obj.text : null;
  } catch {
    return null;
  }
}

interface McqDataRow {
  content: string | null;
}

async function fetchMcqRows(options: {
  subject?: string;
  storefrontOnly?: boolean;
  limit?: number;
}): Promise<McqDataRow[] | null> {
  try {
    let query = supabase
      .from("mcqdata")
      .select("content")
      .not("content", "is", null)
      .limit(options.limit ?? 60);

    if (options.subject) {
      query = query.ilike("subject", options.subject);
    }
    if (options.storefrontOnly) {
      query = query.eq("storefront_enabled", true);
    }

    const { data, error } = await query;
    if (error) return null;
    return (data ?? []) as McqDataRow[];
  } catch {
    return null;
  }
}

function pickRandomPassage(rows: McqDataRow[]): string | null {
  const passages = rows
    .map((row) => (typeof row.content === "string" ? row.content.trim() : ""))
    .filter((content) => content.length > 40);

  if (passages.length === 0) return null;
  const pickedIndex = Math.floor(Math.random() * passages.length);
  return passages[pickedIndex] ?? null;
}

/** Fetch random passage from Supabase mcqdata table for MDCAT trial quiz (biology first subject). */
export async function getRandomPassageFromMcqData(): Promise<string | null> {
  return getRandomPassageForSubjectFromMcqData("biology");
}

/** Fetch random passage for a specific subject from Supabase mcqdata with graceful fallbacks. */
export async function getRandomPassageForSubjectFromMcqData(subject: QuizSubject): Promise<string | null> {
  const attempts: Array<{ subject?: string; storefrontOnly: boolean }> = [
    { subject, storefrontOnly: true },
    { subject, storefrontOnly: false },
    { storefrontOnly: true },
    { storefrontOnly: false },
  ];

  for (const attempt of attempts) {
    const rows = await fetchMcqRows(attempt);
    if (!rows || rows.length === 0) continue;
    const picked = pickRandomPassage(rows);
    if (picked) return picked;
  }

  return null;
}

export interface QuizData {
  biology: QuizQuestion[];
  chemistry: QuizQuestion[];
  physics: QuizQuestion[];
}

function readQuizData(): QuizData {
  if (typeof window === "undefined") return { biology: [], chemistry: [], physics: [] };
  try {
    const stored = sessionStorage.getItem(QUIZ_DATA_KEY);
    if (!stored) return { biology: [], chemistry: [], physics: [] };
    const parsed = JSON.parse(stored) as Partial<QuizData>;
    return {
      biology: Array.isArray(parsed.biology) ? parsed.biology : [],
      chemistry: Array.isArray(parsed.chemistry) ? parsed.chemistry : [],
      physics: Array.isArray(parsed.physics) ? parsed.physics : [],
    };
  } catch {
    return { biology: [], chemistry: [], physics: [] };
  }
}

function writeQuizData(data: QuizData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(QUIZ_DATA_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/** Save questions for one subject; merges with existing data. */
export function saveQuestionsForSubject(subject: QuizSubject, questions: QuizQuestion[]): void {
  const data = readQuizData();
  data[subject] = questions;
  writeQuizData(data);
}

/** Load all quiz data by subject. */
export function loadQuizData(): QuizData {
  return readQuizData();
}

export const QUESTIONS_PER_SUBJECT = 12;

/** Generate quiz for a subject: fetch passage + call API, with retries. Returns true on success. */
export async function generateQuizForSubject(subject: QuizSubject): Promise<boolean> {
  try {
    const questions = await withRetry(async () => {
      const passage = await getRandomPassageForSubjectFromMcqData(subject);
      const fallbackPassage = passage ?? (await getRandomPassageFromJsonl(JSONL_PATHS[subject]));
      if (!fallbackPassage) throw new Error(`No passage for ${subject}`);
      const qs = await generateQuiz({ passage: fallbackPassage, num_questions: QUESTIONS_PER_SUBJECT });
      if (qs.length === 0) throw new Error(`Empty quiz for ${subject}`);
      return qs;
    }, 3, 1500);
    saveQuestionsForSubject(subject, questions);
    return true;
  } catch {
    return false;
  }
}

/** Prefetch chemistry: random passage from JSONL → API → save with retries. */
export async function prefetchChemistry(): Promise<boolean> {
  return generateQuizForSubject("chemistry");
}

/** Prefetch physics: random passage from JSONL → API → save with retries. */
export async function prefetchPhysics(): Promise<boolean> {
  return generateQuizForSubject("physics");
}

export function saveQuizToStorage(questions: QuizQuestion[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch {
    // ignore
  }
}

/** Returns flat list biology then chemistry then physics for backward compatibility. */
export function loadQuizFromStorage(): QuizQuestion[] | null {
  const data = loadQuizData();
  const flat = [...data.biology, ...data.chemistry, ...data.physics];
  return flat.length > 0 ? flat : null;
}

export function clearQuizStorage(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(QUIZ_DATA_KEY);
    sessionStorage.removeItem(QUIZ_ANSWERS_KEY);
  } catch {
    // ignore
  }
}

const TRIAL_USER_ID_KEY = "prepzy_trial_user_id";
const QUIZ_ANSWERS_KEY = "prepzy_quiz_answers";

/** Get the trailpeoples id stored after trial form submit (for saving to trailquiz). */
export function getTrialUserId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const v = sessionStorage.getItem(TRIAL_USER_ID_KEY);
    if (v == null) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Store trailpeoples id after trial form submit. */
export function setTrialUserId(id: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(TRIAL_USER_ID_KEY, String(id));
  } catch {
    // ignore
  }
}

/** User answers: question index -> selected option index (0–3). */
export function loadQuizAnswers(): Record<number, number> {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(QUIZ_ANSWERS_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Record<string, number>;
    const out: Record<number, number> = {};
    for (const k of Object.keys(parsed)) {
      const idx = parseInt(k, 10);
      if (Number.isFinite(idx) && parsed[k] >= 0 && parsed[k] <= 3) out[idx] = parsed[k];
    }
    return out;
  } catch {
    return {};
  }
}

export function saveQuizAnswers(answers: Record<number, number>): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(answers));
  } catch {
    // ignore
  }
}

const QUIZ_SCORE_KEY = "prepzy_quiz_score";

export interface QuizScore {
  correct: number;
  total: number;
  biologyCorrect: number;
  biologyTotal: number;
  chemistryCorrect: number;
  chemistryTotal: number;
  physicsCorrect: number;
  physicsTotal: number;
}

export function saveQuizScore(score: QuizScore): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(QUIZ_SCORE_KEY, JSON.stringify(score));
  } catch {
    // ignore
  }
}

export function loadQuizScore(): QuizScore | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(QUIZ_SCORE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as QuizScore;
  } catch {
    return null;
  }
}
