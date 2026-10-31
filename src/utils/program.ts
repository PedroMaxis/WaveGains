import type { CurrentProgram, Phase, PeriodizationProgram } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface ProgramPosition {
  week: number;
  totalWeeks: number;
  phase: Phase;
  phaseWeek: number; // semana dentro da fase atual (1..duração)
  finished: boolean;
  mesocycle: number;
}

/** Descobre em que semana/fase do programa o usuário está, a partir da data de início */
export const getProgramPosition = (
  program: PeriodizationProgram,
  startDate: Date,
  now: Date = new Date()
): ProgramPosition => {
  const elapsedWeeks = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (7 * DAY_MS)));
  const totalWeeks = program.phases.reduce((sum, p) => sum + p.duration, 0) || program.duration;
  const finished = elapsedWeeks >= totalWeeks;
  const week = Math.min(elapsedWeeks + 1, totalWeeks);

  let remaining = week;
  let phase = program.phases[program.phases.length - 1];
  let phaseWeek = phase.duration;
  for (const p of program.phases) {
    if (remaining <= p.duration) {
      phase = p;
      phaseWeek = remaining;
      break;
    }
    remaining -= p.duration;
  }

  return { week, totalWeeks, phase, phaseWeek, finished, mesocycle: Math.floor((week - 1) / 4) + 1 };
};

/** Atualiza semana/fase/mesociclo guardados com base na data de hoje */
export const syncProgramPosition = (
  current: CurrentProgram,
  program: PeriodizationProgram | undefined,
  now: Date = new Date()
): CurrentProgram => {
  if (!program) return current;
  const pos = getProgramPosition(program, current.startDate, now);
  if (
    pos.week === current.currentWeek &&
    pos.phase.id === current.currentPhase &&
    pos.mesocycle === current.currentMesocycle
  ) {
    return current;
  }
  return { ...current, currentWeek: pos.week, currentPhase: pos.phase.id, currentMesocycle: pos.mesocycle };
};
