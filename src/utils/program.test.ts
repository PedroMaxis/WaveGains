import { describe, expect, it } from 'vitest';
import { linearProgram } from '../data/programs';
import { getProgramPosition } from './program';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const start = new Date('2025-01-06T12:00:00');
const after = (weeks: number) => new Date(start.getTime() + weeks * WEEK + 1000);

describe('getProgramPosition', () => {
  it('começa na semana 1, primeira fase', () => {
    const pos = getProgramPosition(linearProgram, start, start);
    expect(pos.week).toBe(1);
    expect(pos.phase.id).toBe('linear-hypertrophy');
    expect(pos.finished).toBe(false);
  });

  it('troca de fase quando a anterior termina', () => {
    expect(getProgramPosition(linearProgram, start, after(3)).phase.id).toBe('linear-hypertrophy');
    expect(getProgramPosition(linearProgram, start, after(4)).phase.id).toBe('linear-strength-endurance');
    expect(getProgramPosition(linearProgram, start, after(8)).phase.id).toBe('linear-strength');
  });

  it('para na última semana quando o programa acaba', () => {
    const pos = getProgramPosition(linearProgram, start, after(40));
    expect(pos.finished).toBe(true);
    expect(pos.week).toBe(pos.totalWeeks);
    expect(pos.phase.id).toBe('linear-deload');
  });
});
