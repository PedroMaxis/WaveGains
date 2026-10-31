import { describe, expect, it } from 'vitest';
import { exercises, getExerciseById } from '../data/exercises';
import { linearProgram } from '../data/programs';
import { buildWorkout, exerciseCountFor, getNextSplitDay, getSplit } from './workoutPlan';
import { makeExercise, makeUser, makeWorkout } from './fixtures';

describe('divisões de treino', () => {
  it('todos os exercícios citados existem na biblioteca', () => {
    for (const days of [3, 4, 5]) {
      for (const day of getSplit(days)) {
        for (const id of day.exerciseIds) expect(getExerciseById(id), id).toBeDefined();
      }
    }
  });

  it('a biblioteca cobre todos os grupos musculares', () => {
    const groups = new Set(exercises.map((e) => e.category));
    for (const g of ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'glutes']) {
      expect(groups.has(g as never), g).toBe(true);
    }
  });

  it('escolhe a divisão pela disponibilidade semanal', () => {
    expect(getSplit(3)).toHaveLength(3); // corpo inteiro A/B/C
    expect(getSplit(4)).toHaveLength(2); // superiores/inferiores
    expect(getSplit(6)).toHaveLength(3); // push/pull/legs
  });

  it('gira o dia do treino conforme o histórico', () => {
    const user = makeUser({ weeklyAvailability: 4 });
    const done = makeWorkout('2025-02-01', [makeExercise('squat', [{ weight: 100, reps: 5 }])]);
    expect(getNextSplitDay(user, []).name).toBe('Superiores');
    expect(getNextSplitDay(user, [done]).name).toBe('Inferiores');
    expect(getNextSplitDay(user, [done, done]).name).toBe('Superiores');
  });
});

describe('exerciseCountFor', () => {
  it('respeita o tempo disponível, entre 3 e 7 exercícios', () => {
    expect(exerciseCountFor(20, 'beginner')).toBe(3);
    expect(exerciseCountFor(60, 'intermediate')).toBe(5);
    expect(exerciseCountFor(180, 'advanced')).toBe(7);
  });
});

describe('buildWorkout', () => {
  const user = makeUser({ weeklyAvailability: 4 });
  const hypertrophy = linearProgram.phases[0];
  const strength = linearProgram.phases[2];

  it('monta séries e repetições a partir da fase', () => {
    const w = buildWorkout(user, hypertrophy, 1, []);
    expect(w.exercises.length).toBe(exerciseCountFor(user.preferences.timePerSession, user.level));
    const compound = w.exercises[0];
    expect(compound.targetSets).toBe(4); // volume alto
    expect(compound.targetReps).toBe('8-10');
    expect(compound.sets.every((s) => !s.done)).toBe(true);
  });

  it('na fase de força: menos repetições e mais descanso', () => {
    const w = buildWorkout(user, strength, 9, []);
    expect(w.exercises[0].targetReps).toBe('3-4');
    expect(w.exercises[0].restTime).toBe(180);
  });

  it('já vem preenchido com a última carga usada', () => {
    const history = [makeWorkout('2025-02-01', [makeExercise('bench-press', [{ weight: 80, reps: 8 }])])];
    const w = buildWorkout(user, hypertrophy, 1, history);
    // com histórico de 1 treino, hoje é o dia "Inferiores"; o supino não entra
    expect(w.name).toBe('Inferiores');
    const upper = buildWorkout(user, hypertrophy, 1, [...history, history[0]]);
    expect(upper.exercises.find((e) => e.exerciseId === 'bench-press')?.sets[0].weight).toBe(80);
  });

  it('prancha é medida em segundos, sem carga', () => {
    const legs = buildWorkout(makeUser({ weeklyAvailability: 5, preferences: { preferredSplit: '', availableEquipment: [], timePerSession: 105 } }), hypertrophy, 1, [
      makeWorkout('2025-02-01', [makeExercise('bench-press', [{ weight: 50, reps: 8 }])]),
      makeWorkout('2025-02-03', [makeExercise('barbell-rows', [{ weight: 50, reps: 8 }])]),
    ]);
    const plank = legs.exercises.find((e) => e.exerciseId === 'plank');
    expect(plank?.unit).toBe('s');
    expect(plank?.sets[0].weight).toBe(0);
  });
});
