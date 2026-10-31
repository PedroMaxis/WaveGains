import type { CompletedWorkout, LoggedExercise, UserProfile } from '../types';

export const makeUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'u1',
  name: 'Teste',
  level: 'intermediate',
  experienceMonths: 18,
  weeklyAvailability: 4,
  goals: [],
  preferences: { preferredSplit: '', availableEquipment: [], timePerSession: 60 },
  bodyWeight: 80,
  createdAt: new Date('2025-01-01'),
  ...overrides,
});

export const makeExercise = (
  exerciseId: string,
  sets: { weight: number; reps: number; done?: boolean }[]
): LoggedExercise => ({
  exerciseId,
  name: exerciseId,
  targetSets: sets.length,
  targetReps: '8-10',
  restTime: 90,
  sets: sets.map((s) => ({ weight: s.weight, reps: s.reps, done: s.done ?? true })),
});

export const makeWorkout = (
  date: string,
  exercises: LoggedExercise[],
  overrides: Partial<CompletedWorkout> = {}
): CompletedWorkout => ({
  id: `w-${date}`,
  name: 'Treino',
  date: new Date(date),
  week: 1,
  phaseId: 'linear-hypertrophy',
  durationMin: 45,
  volume: exercises.reduce((n, e) => n + e.sets.reduce((m, s) => m + s.weight * s.reps, 0), 0),
  exercises,
  ...overrides,
});
