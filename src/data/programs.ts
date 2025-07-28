import type { PeriodizationProgram, ExperienceLevel } from '../types';

// Linear Periodization Program
export const linearProgram: PeriodizationProgram = {
  id: 'linear-basic',
  name: 'Periodização Linear Tradicional',
  model: 'linear',
  description: 'Progressão gradual com diminuição do volume e aumento da intensidade ao longo do tempo. Ideal para iniciantes e intermediários.',
  duration: 12,
  phases: [
    {
      id: 'linear-hypertrophy',
      name: 'Base de Hipertrofia',
      duration: 4,
      focus: 'Volume alto para adaptações estruturais',
      volumeLoad: 'high',
      intensityRange: { min: 65, max: 75 },
      repRanges: [8, 10, 12, 15],
      characteristics: [
        'Foco em volume total',
        'Desenvolvimento de resistência muscular',
        'Adaptações metabólicas',
        'Técnica de movimento'
      ]
    },
    {
      id: 'linear-strength-endurance',
      name: 'Força-Resistência',
      duration: 4,
      focus: 'Transição para cargas mais altas',
      volumeLoad: 'moderate',
      intensityRange: { min: 75, max: 85 },
      repRanges: [6, 8, 10],
      characteristics: [
        'Redução gradual do volume',
        'Aumento da intensidade',
        'Melhora da coordenação neuromuscular',
        'Preparação para cargas máximas'
      ]
    },
    {
      id: 'linear-strength',
      name: 'Força Máxima',
      duration: 3,
      focus: 'Máximo desenvolvimento de força',
      volumeLoad: 'low',
      intensityRange: { min: 85, max: 95 },
      repRanges: [3, 4, 5, 6],
      characteristics: [
        'Volume baixo, intensidade alta',
        'Desenvolvimento da força máxima',
        'Adaptações neurais',
        'Técnica refinada'
      ]
    },
    {
      id: 'linear-deload',
      name: 'Recuperação Ativa',
      duration: 1,
      focus: 'Recuperação e adaptação',
      volumeLoad: 'low',
      intensityRange: { min: 50, max: 70 },
      repRanges: [8, 10, 12],
      characteristics: [
        'Redução significativa do volume',
        'Intensidade moderada',
        'Recuperação ativa',
        'Preparação para novo ciclo'
      ]
    }
  ],
  recommendedFor: ['beginner', 'intermediate']
};

// Undulating Periodization Program
export const undulatingProgram: PeriodizationProgram = {
  id: 'undulating-dup',
  name: 'Periodização Ondulatória (DUP)',
  model: 'undulating',
  description: 'Variação constante de volume e intensidade dentro da mesma semana. Ideal para intermediários e avançados.',
  duration: 8,
  phases: [
    {
      id: 'dup-hypertrophy',
      name: 'Dia de Hipertrofia',
      duration: 8, // recurring pattern
      focus: 'Volume alto, intensidade moderada',
      volumeLoad: 'high',
      intensityRange: { min: 65, max: 75 },
      repRanges: [8, 10, 12],
      characteristics: [
        'Foco em volume total',
        'Tempo sob tensão elevado',
        'Metabolismo anaeróbico',
        'Bomba muscular'
      ]
    },
    {
      id: 'dup-strength',
      name: 'Dia de Força',
      duration: 8, // recurring pattern
      focus: 'Volume baixo, intensidade alta',
      volumeLoad: 'low',
      intensityRange: { min: 80, max: 90 },
      repRanges: [3, 4, 5],
      characteristics: [
        'Força máxima',
        'Adaptações neurais',
        'Coordenação intramuscular',
        'Potência'
      ]
    },
    {
      id: 'dup-power-endurance',
      name: 'Dia de Resistência',
      duration: 8, // recurring pattern
      focus: 'Volume moderado, intensidade baixa',
      volumeLoad: 'moderate',
      intensityRange: { min: 60, max: 70 },
      repRanges: [12, 15, 20],
      characteristics: [
        'Resistência muscular',
        'Capacidade aeróbica local',
        'Recuperação ativa',
        'Densidade de capilares'
      ]
    }
  ],
  recommendedFor: ['intermediate', 'advanced']
};

// Block Periodization Program
export const blockProgram: PeriodizationProgram = {
  id: 'block-conjugate',
  name: 'Periodização por Blocos',
  model: 'block',
  description: 'Blocos sequenciais focando em qualidades específicas. Acumulação → Transmutação → Realização.',
  duration: 12,
  phases: [
    {
      id: 'block-accumulation',
      name: 'Bloco de Acumulação',
      duration: 5,
      focus: 'Volume máximo, capacidade de trabalho',
      volumeLoad: 'high',
      intensityRange: { min: 60, max: 75 },
      repRanges: [8, 10, 12, 15],
      characteristics: [
        'Volume extremo',
        'Capacidade de trabalho',
        'Adaptações metabólicas',
        'Hipertrofia máxima',
        'Densidade mitocondrial'
      ]
    },
    {
      id: 'block-transmutation',
      name: 'Bloco de Transmutação',
      duration: 4,
      focus: 'Conversão em força, intensidade crescente',
      volumeLoad: 'moderate',
      intensityRange: { min: 75, max: 85 },
      repRanges: [5, 6, 8],
      characteristics: [
        'Transformação das adaptações',
        'Força-velocidade',
        'Coordenação intermuscular',
        'Eficiência neural'
      ]
    },
    {
      id: 'block-realization',
      name: 'Bloco de Realização',
      duration: 2,
      focus: 'Expressão máxima da força',
      volumeLoad: 'low',
      intensityRange: { min: 85, max: 100 },
      repRanges: [1, 2, 3, 4],
      characteristics: [
        'Força máxima',
        'Picos de performance',
        'Coordenação refinada',
        'Confiança técnica'
      ]
    },
    {
      id: 'block-deload',
      name: 'Recuperação',
      duration: 1,
      focus: 'Supercompensação e recovery',
      volumeLoad: 'low',
      intensityRange: { min: 50, max: 70 },
      repRanges: [8, 10],
      characteristics: [
        'Recuperação completa',
        'Movimento de qualidade',
        'Preparação mental',
        'Análise de resultados'
      ]
    }
  ],
  recommendedFor: ['advanced']
};

// Conjugate Method Program
export const conjugateProgram: PeriodizationProgram = {
  id: 'conjugate-westside',
  name: 'Método Conjugado',
  model: 'conjugate',
  description: 'Desenvolvimento simultâneo de diferentes qualidades. Baseado no método Westside Barbell.',
  duration: 16, // continuous cycle
  phases: [
    {
      id: 'conjugate-max-effort',
      name: 'Esforço Máximo',
      duration: 16, // recurring pattern
      focus: 'Força máxima, 1-3RM',
      volumeLoad: 'low',
      intensityRange: { min: 90, max: 105 },
      repRanges: [1, 2, 3],
      characteristics: [
        'Força máxima absoluta',
        'Coordenação intramuscular',
        'Confiança psicológica',
        'Técnica sob máxima tensão'
      ]
    },
    {
      id: 'conjugate-dynamic-effort',
      name: 'Esforço Dinâmico',
      duration: 16, // recurring pattern
      focus: 'Velocidade e potência',
      volumeLoad: 'moderate',
      intensityRange: { min: 50, max: 60 },
      repRanges: [3, 5],
      characteristics: [
        'Velocidade de contração',
        'Potência muscular',
        'Taxa de desenvolvimento de força',
        'Coordenação rápida'
      ]
    },
    {
      id: 'conjugate-repetition',
      name: 'Método de Repetições',
      duration: 16, // recurring pattern
      focus: 'Hipertrofia e resistência',
      volumeLoad: 'high',
      intensityRange: { min: 60, max: 80 },
      repRanges: [8, 12, 15, 20],
      characteristics: [
        'Hipertrofia funcional',
        'Resistência muscular',
        'Volume de trabalho',
        'Recuperação entre treinos intensos'
      ]
    }
  ],
  recommendedFor: ['advanced']
};

export const allPrograms: PeriodizationProgram[] = [
  linearProgram,
  undulatingProgram,
  blockProgram,
  conjugateProgram
];

export const getProgramsByLevel = (level: ExperienceLevel): PeriodizationProgram[] => {
  return allPrograms.filter(program => 
    program.recommendedFor.includes(level)
  );
};

export const getProgramById = (id: string): PeriodizationProgram | undefined => {
  return allPrograms.find(program => program.id === id);
};
