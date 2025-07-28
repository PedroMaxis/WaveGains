import type { QuizQuestion } from '../types';

export const onboardingQuestions: QuizQuestion[] = [
  {
    id: 'name',
    question: 'Como você gostaria de ser chamado?',
    type: 'input',
    required: true
  },
  {
    id: 'experience',
    question: 'Há quanto tempo você treina musculação?',
    type: 'single',
    options: [
      'Menos de 6 meses (Iniciante)',
      '6 meses a 1 ano (Iniciante-Intermediário)',
      '1-2 anos (Intermediário)',
      '2-3 anos (Intermediário-Avançado)',
      'Mais de 3 anos (Avançado)'
    ],
    required: true
  },
  {
    id: 'goals',
    question: 'Quais são seus principais objetivos? (Selecione até 3)',
    type: 'multiple',
    options: [
      'Ganhar massa muscular',
      'Aumentar força',
      'Melhorar definição',
      'Melhorar performance atlética',
      'Reabilitação/prevenção de lesões',
      'Melhora da saúde geral'
    ],
    required: true
  },
  {
    id: 'availability',
    question: 'Quantos dias por semana você pode treinar?',
    type: 'single',
    options: [
      '2-3 dias',
      '4 dias',
      '5 dias',
      '6+ dias'
    ],
    required: true
  },
  {
    id: 'session-duration',
    question: 'Quanto tempo você tem disponível por treino?',
    type: 'single',
    options: [
      '30-45 minutos',
      '45-60 minutos',
      '60-90 minutos',
      'Mais de 90 minutos'
    ],
    required: true
  },
  {
    id: 'equipment',
    question: 'Que equipamentos você tem acesso? (Selecione todos que se aplicam)',
    type: 'multiple',
    options: [
      'Barras e anilhas',
      'Halteres',
      'Máquinas de musculação',
      'Cabo/polia',
      'Barra fixa',
      'Paralelas',
      'Kettlebells',
      'Elásticos/faixas'
    ],
    required: true
  },
  {
    id: 'training-split',
    question: 'Que tipo de divisão de treino você prefere?',
    type: 'single',
    options: [
      'Corpo inteiro (Full Body)',
      'Superior/Inferior (Upper/Lower)',
      'Push/Pull/Legs',
      'Divisão por grupos musculares',
      'Não tenho preferência'
    ],
    required: true
  },
  {
    id: 'injury-history',
    question: 'Você tem histórico de lesões ou limitações?',
    type: 'single',
    options: [
      'Nenhuma limitação',
      'Problemas no joelho',
      'Problemas nas costas',
      'Problemas no ombro',
      'Outras limitações'
    ],
    required: true
  },
  {
    id: 'periodization-knowledge',
    question: 'Qual seu nível de conhecimento sobre periodização?',
    type: 'single',
    options: [
      'Nunca ouvi falar',
      'Conheço superficialmente',
      'Tenho conhecimento básico',
      'Conheço bem os conceitos',
      'Tenho experiência prática'
    ],
    required: true
  },
  {
    id: 'motivation',
    question: 'O que mais te motiva a treinar?',
    type: 'single',
    options: [
      'Resultados estéticos',
      'Performance e força',
      'Saúde e bem-estar',
      'Competição/esporte',
      'Desafio pessoal'
    ],
    required: true
  },
  {
    id: 'body-weight',
    question: 'Qual seu peso corporal atual? (kg)',
    type: 'range',
    min: 40,
    max: 150,
    required: true
  }
];

export const evaluateQuizResults = (answers: any[]) => {
  const experienceAnswer = answers.find(a => a.questionId === 'experience')?.answer;
  const availabilityAnswer = answers.find(a => a.questionId === 'availability')?.answer;
  const knowledgeAnswer = answers.find(a => a.questionId === 'periodization-knowledge')?.answer;
  
  // Determine experience level
  let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  
  if (experienceAnswer?.includes('Menos de 6 meses') || experienceAnswer?.includes('6 meses a 1 ano')) {
    level = 'beginner';
  } else if (experienceAnswer?.includes('1-2 anos') || experienceAnswer?.includes('2-3 anos')) {
    level = 'intermediate';
  } else if (experienceAnswer?.includes('Mais de 3 anos')) {
    level = 'advanced';
  }
  
  // Adjust based on knowledge
  if (knowledgeAnswer?.includes('Nunca ouvi falar') || knowledgeAnswer?.includes('superficialmente')) {
    if (level === 'advanced') level = 'intermediate';
    if (level === 'intermediate') level = 'beginner';
  }
  
  // Recommend program based on level and availability
  let recommendedProgram = 'linear-basic';
  
  if (level === 'beginner') {
    recommendedProgram = 'linear-basic';
  } else if (level === 'intermediate') {
    if (availabilityAnswer?.includes('4 dias') || availabilityAnswer?.includes('5 dias')) {
      recommendedProgram = 'undulating-dup';
    } else {
      recommendedProgram = 'linear-basic';
    }
  } else if (level === 'advanced') {
    if (availabilityAnswer?.includes('6+ dias')) {
      recommendedProgram = 'conjugate-westside';
    } else if (availabilityAnswer?.includes('5 dias') || availabilityAnswer?.includes('4 dias')) {
      recommendedProgram = 'block-conjugate';
    } else {
      recommendedProgram = 'undulating-dup';
    }
  }
  
  return {
    level,
    recommendedProgram,
    experienceMonths: getExperienceInMonths(experienceAnswer),
    weeklyAvailability: getWeeklyDays(availabilityAnswer)
  };
};

const getExperienceInMonths = (answer: string): number => {
  if (answer?.includes('Menos de 6 meses')) return 3;
  if (answer?.includes('6 meses a 1 ano')) return 9;
  if (answer?.includes('1-2 anos')) return 18;
  if (answer?.includes('2-3 anos')) return 30;
  if (answer?.includes('Mais de 3 anos')) return 48;
  return 6;
};

const getWeeklyDays = (answer: string): number => {
  if (answer?.includes('2-3 dias')) return 3;
  if (answer?.includes('4 dias')) return 4;
  if (answer?.includes('5 dias')) return 5;
  if (answer?.includes('6+ dias')) return 6;
  return 3;
};
