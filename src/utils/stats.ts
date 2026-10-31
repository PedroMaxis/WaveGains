import type { CompletedWorkout, CurrentProgram, LoggedExercise, PersonalRecord } from '../types';
import { calculateOneRM } from './calculations';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Segunda-feira 00:00 da semana da data informada */
export const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = (d.getDay() + 6) % 7; // segunda = 0
  d.setDate(d.getDate() - diff);
  return d;
};

export const workoutVolume = (exercises: LoggedExercise[]): number =>
  exercises.reduce(
    (total, ex) =>
      total + ex.sets.filter((s) => s.done).reduce((sum, s) => sum + s.weight * s.reps, 0),
    0
  );

export const countDoneSets = (exercises: LoggedExercise[]): number =>
  exercises.reduce((n, ex) => n + ex.sets.filter((s) => s.done).length, 0);

export const workoutsThisWeek = (history: CompletedWorkout[], now: Date = new Date()): number => {
  const start = startOfWeek(now).getTime();
  return history.filter((w) => w.date.getTime() >= start).length;
};

export const weeklyVolumeSeries = (
  history: CompletedWorkout[],
  weeks = 8,
  now: Date = new Date()
): { week: string; volume: number }[] => {
  const thisWeek = startOfWeek(now).getTime();
  const series = Array.from({ length: weeks }, (_, i) => {
    const start = thisWeek - (weeks - 1 - i) * 7 * DAY_MS;
    const label = new Date(start).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { start, week: label, volume: 0 };
  });
  for (const w of history) {
    const t = startOfWeek(w.date).getTime();
    const bucket = series.find((b) => b.start === t);
    if (bucket) bucket.volume += w.volume;
  }
  return series.map(({ week, volume }) => ({ week, volume: Math.round(volume) }));
};

/** Variação de volume da semana atual contra a anterior (null se não há base) */
export const volumeChange = (history: CompletedWorkout[], now: Date = new Date()): number | null => {
  const series = weeklyVolumeSeries(history, 2, now);
  const [prev, curr] = [series[0].volume, series[1].volume];
  if (prev <= 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
};

export const bestEstimated1RM = (ex: LoggedExercise): number => {
  let best = 0;
  for (const s of ex.sets) {
    if (!s.done || s.weight <= 0 || s.reps <= 0 || ex.unit === 's') continue;
    best = Math.max(best, calculateOneRM(s.weight, s.reps).estimated1RM);
  }
  return best;
};

/** Atualiza recordes pessoais com um treino concluído; devolve também os que foram batidos agora */
export const applyPersonalRecords = (
  records: PersonalRecord[],
  workout: CompletedWorkout
): { records: PersonalRecord[]; broken: string[] } => {
  const next = [...records];
  const broken: string[] = [];
  for (const ex of workout.exercises) {
    const e1rm = bestEstimated1RM(ex);
    if (e1rm <= 0) continue;
    const idx = next.findIndex((r) => r.exerciseId === ex.exerciseId);
    if (idx === -1 || e1rm > next[idx].estimatedMax) {
      const top = ex.sets
        .filter((s) => s.done)
        .reduce((a, b) => (calculateOneRM(b.weight, b.reps).estimated1RM > calculateOneRM(a.weight, a.reps).estimated1RM ? b : a));
      const record: PersonalRecord = {
        exerciseId: ex.exerciseId,
        weight: top.weight,
        reps: top.reps,
        date: workout.date,
        estimatedMax: e1rm,
      };
      if (idx === -1) next.push(record);
      else next[idx] = record;
      // o primeiro registro não conta como "recorde batido"
      if (idx !== -1) broken.push(ex.exerciseId);
    }
  }
  return { records: next, broken };
};

/** Primeiro 1RM estimado vs melhor atual, por exercício (só quem tem 2+ treinos) */
export const strengthProgress = (
  history: CompletedWorkout[],
  limit = 5
): { exercise: string; inicial: number; atual: number }[] => {
  const map = new Map<string, { name: string; values: number[] }>();
  for (const w of history) {
    for (const ex of w.exercises) {
      const e = bestEstimated1RM(ex);
      if (e <= 0) continue;
      const entry = map.get(ex.exerciseId) ?? { name: ex.name, values: [] };
      entry.values.push(e);
      map.set(ex.exerciseId, entry);
    }
  }
  return [...map.values()]
    .filter((e) => e.values.length >= 2)
    .sort((a, b) => b.values.length - a.values.length)
    .slice(0, limit)
    .map((e) => ({
      exercise: e.name,
      inicial: e.values[0],
      atual: Math.max(...e.values),
    }));
};

export const formatVolume = (kg: number): string =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1).replace('.', ',')}k kg` : `${Math.round(kg)} kg`;

export const progressMetricsFrom = (program: CurrentProgram): CurrentProgram['progressMetrics'] => {
  const history = program.history;
  const gains: CurrentProgram['progressMetrics']['strengthGains'] = {};
  for (const w of history) {
    for (const ex of w.exercises) {
      const e = bestEstimated1RM(ex);
      if (e <= 0) continue;
      const g = gains[ex.exerciseId];
      if (!g) gains[ex.exerciseId] = { initial: e, current: e, improvement: 0 };
      else {
        g.current = Math.max(g.current, e);
        g.improvement = Math.round(((g.current - g.initial) / g.initial) * 100);
      }
    }
  }
  return {
    totalVolume: history.map((w) => w.volume),
    averageIntensity: program.progressMetrics.averageIntensity,
    workoutsCompleted: history.length,
    totalWorkouts: program.progressMetrics.totalWorkouts,
    strengthGains: gains,
  };
};
