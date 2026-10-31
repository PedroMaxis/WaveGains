import { describe, expect, it } from 'vitest';
import { evaluateQuizResults } from './quiz';

const answers = (experience: string, knowledge: string, availability = '4 dias') => [
  { questionId: 'experience', answer: experience },
  { questionId: 'periodization-knowledge', answer: knowledge },
  { questionId: 'availability', answer: availability },
];

describe('evaluateQuizResults', () => {
  it('avançado que nunca ouviu falar de periodização cai só um degrau (intermediário)', () => {
    const r = evaluateQuizResults(answers('Mais de 3 anos (Avançado)', 'Nunca ouvi falar'));
    expect(r.level).toBe('intermediate');
  });

  it('intermediário com pouco conhecimento vira iniciante', () => {
    const r = evaluateQuizResults(answers('1-2 anos (Intermediário)', 'Conheço superficialmente'));
    expect(r.level).toBe('beginner');
  });

  it('recomenda programa a partir do nível e da disponibilidade', () => {
    expect(evaluateQuizResults(answers('Menos de 6 meses (Iniciante)', 'x')).recommendedProgram).toBe('linear-basic');
    expect(evaluateQuizResults(answers('1-2 anos (Intermediário)', 'Conheço bem')).recommendedProgram).toBe(
      'undulating-dup'
    );
  });
});
