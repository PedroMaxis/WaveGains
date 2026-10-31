import { describe, expect, it } from 'vitest';
import {
  applyPersonalRecords,
  countDoneSets,
  startOfWeek,
  volumeChange,
  weeklyVolumeSeries,
  workoutVolume,
} from './stats';
import { makeExercise, makeWorkout } from './fixtures';

describe('volume', () => {
  it('soma só as séries concluídas', () => {
    const ex = makeExercise('squat', [
      { weight: 100, reps: 5 },
      { weight: 100, reps: 5 },
      { weight: 100, reps: 5, done: false },
    ]);
    expect(workoutVolume([ex])).toBe(1000);
    expect(countDoneSets([ex])).toBe(2);
  });
});

describe('semanas', () => {
  it('a semana começa na segunda-feira', () => {
    const wednesday = new Date('2025-03-05T15:30:00'); // quarta
    const monday = startOfWeek(wednesday);
    expect(monday.getDay()).toBe(1);
    expect(monday.getHours()).toBe(0);
  });

  it('agrupa o volume por semana e compara com a anterior', () => {
    const now = new Date('2025-03-05T12:00:00');
    const history = [
      makeWorkout('2025-02-25T10:00:00', [makeExercise('squat', [{ weight: 100, reps: 10 }])]), // semana passada: 1000
      makeWorkout('2025-03-03T10:00:00', [makeExercise('squat', [{ weight: 100, reps: 12 }])]), // esta semana: 1200
    ];
    const series = weeklyVolumeSeries(history, 3, now);
    expect(series.map((s) => s.volume)).toEqual([0, 1000, 1200]);
    expect(volumeChange(history, now)).toBe(20);
  });

  it('sem semana anterior não inventa porcentagem', () => {
    const now = new Date('2025-03-05T12:00:00');
    const history = [makeWorkout('2025-03-03T10:00:00', [makeExercise('squat', [{ weight: 100, reps: 10 }])])];
    expect(volumeChange(history, now)).toBeNull();
  });
});

describe('recordes pessoais', () => {
  const first = makeWorkout('2025-03-01', [makeExercise('bench-press', [{ weight: 80, reps: 8 }])]);
  const better = makeWorkout('2025-03-08', [makeExercise('bench-press', [{ weight: 85, reps: 8 }])]);
  const worse = makeWorkout('2025-03-15', [makeExercise('bench-press', [{ weight: 70, reps: 8 }])]);

  it('o primeiro registro cria o recorde, mas não conta como "batido"', () => {
    const { records, broken } = applyPersonalRecords([], first);
    expect(records).toHaveLength(1);
    expect(broken).toEqual([]);
  });

  it('carga maior bate o recorde; menor não altera', () => {
    const a = applyPersonalRecords([], first);
    const b = applyPersonalRecords(a.records, better);
    expect(b.broken).toEqual(['bench-press']);
    expect(b.records[0].weight).toBe(85);

    const c = applyPersonalRecords(b.records, worse);
    expect(c.broken).toEqual([]);
    expect(c.records[0].weight).toBe(85);
  });
});
