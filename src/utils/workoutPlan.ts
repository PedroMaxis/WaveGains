import type {
  CompletedWorkout,
  ExperienceLevel,
  LoggedExercise,
  Phase,
  UserProfile,
  WorkoutDraft,
} from '../types';
import { getExerciseById } from '../data/exercises';

export interface SplitDay {
  name: string;
  /** Exercícios em ordem de prioridade (compostos primeiro) */
  exerciseIds: string[];
}

const PUSH: SplitDay = {
  name: 'Push · Peito, ombros e tríceps',
  exerciseIds: ['bench-press', 'overhead-press', 'incline-dumbbell-press', 'lateral-raises', 'triceps-pushdown', 'tricep-dips', 'push-ups'],
};
const PULL: SplitDay = {
  name: 'Pull · Costas e bíceps',
  exerciseIds: ['barbell-rows', 'lat-pulldown', 'seated-cable-row', 'face-pull', 'barbell-curls', 'hammer-curl', 'pull-ups'],
};
const LEGS: SplitDay = {
  name: 'Pernas e core',
  exerciseIds: ['squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'calf-raise', 'plank', 'cable-crunch'],
};
const UPPER: SplitDay = {
  name: 'Superiores',
  exerciseIds: ['bench-press', 'barbell-rows', 'overhead-press', 'lat-pulldown', 'barbell-curls', 'triceps-pushdown', 'lateral-raises'],
};
const LOWER: SplitDay = {
  name: 'Inferiores',
  exerciseIds: ['squat', 'romanian-deadlift', 'hip-thrust', 'leg-press', 'leg-curl', 'calf-raise', 'cable-crunch'],
};
const FULL_A: SplitDay = {
  name: 'Corpo inteiro A',
  exerciseIds: ['squat', 'bench-press', 'barbell-rows', 'lateral-raises', 'plank', 'barbell-curls', 'calf-raise'],
};
const FULL_B: SplitDay = {
  name: 'Corpo inteiro B',
  exerciseIds: ['romanian-deadlift', 'overhead-press', 'lat-pulldown', 'leg-press', 'triceps-pushdown', 'face-pull', 'cable-crunch'],
};
const FULL_C: SplitDay = {
  name: 'Corpo inteiro C',
  exerciseIds: ['leg-press', 'incline-dumbbell-press', 'seated-cable-row', 'hip-thrust', 'dumbbell-shoulder-press', 'hammer-curl', 'plank'],
};

/** Divisão semanal de acordo com a disponibilidade do usuário */
export const getSplit = (daysPerWeek: number): SplitDay[] => {
  if (daysPerWeek <= 3) return [FULL_A, FULL_B, FULL_C];
  if (daysPerWeek === 4) return [UPPER, LOWER];
  return [PUSH, PULL, LEGS];
};

/** Quantos exercícios cabem na sessão, pelo tempo disponível */
export const exerciseCountFor = (minutes: number, level: ExperienceLevel): number => {
  const base = Math.round(minutes / 13);
  const bonus = level === 'advanced' ? 1 : 0;
  return Math.min(7, Math.max(3, base + bonus));
};

const repsFor = (phase: Phase, compound: boolean): string => {
  const reps = [...phase.repRanges].sort((a, b) => a - b);
  if (reps.length <= 1) return String(reps[0] ?? 10);
  const [lo, hi] = compound ? [reps[0], reps[1]] : [reps[reps.length - 2], reps[reps.length - 1]];
  return lo === hi ? String(lo) : `${lo}-${hi}`;
};

const setsFor = (phase: Phase): number => (phase.volumeLoad === 'high' ? 4 : 3);

const restFor = (phase: Phase, compound: boolean): number => {
  const max = phase.intensityRange.max;
  if (max >= 85) return compound ? 180 : 90;
  if (max >= 75) return compound ? 120 : 75;
  return compound ? 90 : 60;
};

/** Último peso usado em um exercício (para já vir preenchido) */
export const lastWeightFor = (history: CompletedWorkout[], exerciseId: string): number => {
  for (let i = history.length - 1; i >= 0; i--) {
    const ex = history[i].exercises.find((e) => e.exerciseId === exerciseId);
    const done = ex?.sets.filter((s) => s.done && s.weight > 0) ?? [];
    if (done.length) return Math.max(...done.map((s) => s.weight));
  }
  return 0;
};

/** Qual dia da divisão vem agora: gira conforme o número de treinos já feitos */
export const getNextSplitDay = (user: UserProfile, history: CompletedWorkout[]): SplitDay => {
  const split = getSplit(user.weeklyAvailability);
  return split[history.length % split.length];
};

export const buildWorkout = (
  user: UserProfile,
  phase: Phase,
  week: number,
  history: CompletedWorkout[],
  now: Date = new Date()
): WorkoutDraft => {
  const day = getNextSplitDay(user, history);
  const count = exerciseCountFor(user.preferences.timePerSession, user.level);

  const exercises: LoggedExercise[] = day.exerciseIds
    .slice(0, count)
    .map((id) => getExerciseById(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .map((ex) => {
      const compound = ex.type === 'compound';
      const timed = ex.id === 'plank';
      const targetSets = setsFor(phase);
      const targetReps = timed ? '30-45' : repsFor(phase, compound);
      const upper = parseInt(targetReps.split('-').pop() ?? '10', 10);
      const weight = timed ? 0 : lastWeightFor(history, ex.id);
      return {
        exerciseId: ex.id,
        name: ex.name,
        targetSets,
        targetReps,
        ...(timed ? { unit: 's' as const } : {}),
        restTime: restFor(phase, compound),
        sets: Array.from({ length: targetSets }, () => ({ weight, reps: upper, done: false })),
      };
    });

  return { name: day.name, startedAt: now, week, phaseId: phase.id, exercises };
};
