const GENERATE_API = "https://api.prepzy.tech/generate";

/** Default passage used for the trial quiz (decided by us). */
export const TRIAL_QUIZ_PASSAGE = `Chemical kinetics is the branch of chemistry that deals with the study of the rates of chemical reactions, the factors affecting these rates, and the mechanisms by which reactions occur. Chemical reactions are dynamic processes in which matter and energy are continuously transformed. Some reactions are extremely fast, such as acid–base neutralization, which may occur in microseconds. Others are very slow, like fermentation, which can take weeks to produce noticeable amounts of product. Many biological reactions, including muscle contraction and nerve impulse transmission, occur at moderate speeds. In industry, understanding reaction rates is essential to determine the most economical and efficient conditions for large-scale production. The rate of a reaction is defined as the change in concentration of reactants or products per unit time. Mathematically, it is expressed as: Rate = Change in concentration / Time taken Since concentration is measured in mole dm⁻³ and time in seconds, the unit of rate is mole dm⁻³ s⁻¹. As a reaction proceeds, the concentration of reactants decreases while that of products increases. Therefore, the rate can be expressed either as the decrease in concentration of reactants or the increase in concentration of products. For a general reaction A → B, the rate is written as: Rate = −d[A]/dt = +d[B]/dt The negative sign indicates the decrease in reactant concentration, while the positive sign represents the increase in product concentration. The rate measured over a time interval is called the average rate, while the rate at a specific instant is known as the instantaneous rate. The instantaneous rate is determined from the slope of the tangent drawn to the concentration–time graph at that point. When the time interval becomes very small, the average rate approaches the instantaneous rate. To determine how concentration affects reaction rate, chemists often measure the initial rate, which is the instantaneous rate at the moment reactants are mixed (t = 0). At this stage, complications such as reverse reactions are minimal. The slope of the tangent at zero time gives the initial rate. Experimental observations show that the rate of a reaction depends on the concentration of reactants raised to certain powers. This relationship is called the rate law. For a simple reaction A → Products: Rate = k[A]ˣ Here, k is the rate constant, and x is the order of reaction with respect to A.`;

/** Raw question shape from API (inside response.raw JSON string) */
export interface ApiQuestion {
  question: string;
  options: Record<string, string>; // e.g. { A: "...", B: "...", C: "...", D: "..." }
  correct_answer: string; // "A" | "B" | "C" | "D"
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

/** Parse API raw string and convert to QuizQuestion[] */
export function parseGenerateRaw(raw: string): QuizQuestion[] {
  let parsed: ApiQuestion[];
  try {
    parsed = JSON.parse(raw) as ApiQuestion[];
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed.map((q, index) => {
    const optionsArray = OPTION_ORDER.map((key) => q.options?.[key] ?? "").filter(Boolean);
    const correctLetter = (q.correct_answer ?? "A").toUpperCase();
    const correctIndex = Math.max(0, OPTION_ORDER.indexOf(correctLetter));
    return {
      id: index + 1,
      question: q.question ?? "",
      options: optionsArray.length ? optionsArray : ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: correctIndex < optionsArray.length ? correctIndex : 0,
      explanation: q.explanation,
      difficulty: q.difficulty,
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

  const data = (await res.json()) as GenerateResponse;
  const raw = data?.raw ?? "";
  return parseGenerateRaw(raw);
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

export const QUESTIONS_PER_SUBJECT = 10;

/** Prefetch chemistry: random passage from JSONL → API → save. Fire-and-forget; run once per session. */
export async function prefetchChemistry(): Promise<void> {
  const passage = await getRandomPassageFromJsonl(JSONL_PATHS.chemistry);
  if (!passage) return;
  try {
    const questions = await generateQuiz({ passage, num_questions: QUESTIONS_PER_SUBJECT });
    if (questions.length > 0) saveQuestionsForSubject("chemistry", questions);
  } catch {
    // non-blocking; ignore
  }
}

/** Prefetch physics: random passage from JSONL → API → save. Fire-and-forget; run once per session. */
export async function prefetchPhysics(): Promise<void> {
  const passage = await getRandomPassageFromJsonl(JSONL_PATHS.physics);
  if (!passage) return;
  try {
    const questions = await generateQuiz({ passage, num_questions: QUESTIONS_PER_SUBJECT });
    if (questions.length > 0) saveQuestionsForSubject("physics", questions);
  } catch {
    // non-blocking; ignore
  }
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
