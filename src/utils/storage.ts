import type { CurrentProgram, UserProfile, WorkoutDraft } from '../types';

const STATE_KEY = 'wavegains:v1';
const DRAFT_KEY = 'wavegains:draft:v1';
const VERSION = 1;

/** Campos que voltam como string do JSON e precisam virar Date de novo */
const DATE_KEYS = new Set(['createdAt', 'startDate', 'date', 'startedAt']);

export interface PersistedState {
  version: number;
  isDarkMode: boolean;
  user: UserProfile | null;
  currentProgram: CurrentProgram | null;
}

const reviver = (key: string, value: unknown) => {
  if (DATE_KEYS.has(key) && typeof value === 'string') {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return value;
};

/** Garante que o que veio do disco (ou de um arquivo importado) tem o formato esperado */
export const normalizeState = (raw: unknown): PersistedState | null => {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<PersistedState>;
  if (data.version !== VERSION) return null;

  const user = data.user ?? null;
  if (user && (typeof user.id !== 'string' || typeof user.name !== 'string')) return null;

  let program = data.currentProgram ?? null;
  if (program) {
    if (typeof program.programId !== 'string') return null;
    program = {
      ...program,
      history: Array.isArray(program.history) ? program.history : [],
      personalRecords: Array.isArray(program.personalRecords) ? program.personalRecords : [],
      workouts: Array.isArray(program.workouts) ? program.workouts : [],
    };
  }

  return { version: VERSION, isDarkMode: Boolean(data.isDarkMode), user, currentProgram: program };
};

const read = (key: string): unknown => {
  try {
    const text = localStorage.getItem(key);
    return text ? JSON.parse(text, reviver) : null;
  } catch {
    return null;
  }
};

export const loadState = (): PersistedState | null => normalizeState(read(STATE_KEY));

export const saveState = (state: Omit<PersistedState, 'version'>): void => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ version: VERSION, ...state }));
  } catch {
    // armazenamento cheio ou bloqueado: o app continua funcionando, só não persiste
  }
};

export const loadDraft = (): WorkoutDraft | null => {
  const raw = read(DRAFT_KEY) as WorkoutDraft | null;
  if (!raw || !Array.isArray(raw.exercises) || raw.exercises.length === 0) return null;
  return raw;
};

export const saveDraft = (draft: WorkoutDraft): void => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignora */
  }
};

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignora */
  }
};

export const clearAll = (): void => {
  try {
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignora */
  }
};

export const exportState = (state: Omit<PersistedState, 'version'>): string =>
  JSON.stringify({ version: VERSION, ...state }, null, 2);

export const parseImport = (text: string): PersistedState | null => {
  try {
    return normalizeState(JSON.parse(text, reviver));
  } catch {
    return null;
  }
};
