import { describe, expect, it } from 'vitest';
import { calculateOneRM } from './calculations';

describe('calculateOneRM', () => {
  it('arredonda para múltiplos de 2,5 kg (antes arredondava para 0,4 kg)', () => {
    // Epley: 100 * (1 + 5/30) = 116,67 → 117,5
    const { estimated1RM, percentages } = calculateOneRM(100, 5);
    expect(estimated1RM).toBe(117.5);
    for (const value of Object.values(percentages)) expect(value % 2.5).toBe(0);
  });

  it('não explode com muitas repetições na fórmula de Brzycki', () => {
    for (const reps of [36, 37, 50]) {
      const { estimated1RM } = calculateOneRM(60, reps, 'brzycki');
      expect(Number.isFinite(estimated1RM)).toBe(true);
      expect(estimated1RM).toBeGreaterThan(0);
    }
  });

  it('uma repetição devolve a própria carga', () => {
    expect(calculateOneRM(140, 1).estimated1RM).toBeCloseTo(140, -1);
  });
});
