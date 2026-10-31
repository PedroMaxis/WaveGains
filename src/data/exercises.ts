import type { Exercise, MuscleGroup } from '../types';

export const exercises: Exercise[] = [
  // Chest Exercises
  {
    id: 'bench-press',
    name: 'Supino Reto',
    category: 'chest' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell', 'bench'],
    difficulty: 'beginner',
    instructions: [
      'Deite-se no banco com os pés firmes no chão',
      'Posicione as mãos na barra com pegada ligeiramente mais larga que os ombros',
      'Retire a barra do suporte e posicione sobre o peito',
      'Desça a barra controladamente até tocar o peito',
      'Empurre a barra de volta à posição inicial'
    ]
  },
  {
    id: 'incline-bench-press',
    name: 'Supino Inclinado',
    category: 'chest' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell', 'incline-bench'],
    difficulty: 'beginner',
    instructions: [
      'Ajuste o banco para 30-45 graus de inclinação',
      'Posicione-se como no supino reto',
      'Mantenha os ombros retraídos durante o movimento',
      'Desça a barra até a parte superior do peito',
      'Empurre explosivamente de volta ao topo'
    ]
  },
  {
    id: 'dumbbell-flyes',
    name: 'Crucifixo com Halteres',
    category: 'chest' as MuscleGroup,
    type: 'isolation',
    equipment: ['dumbbells', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Deite-se no banco segurando halteres acima do peito',
      'Mantenha uma ligeira flexão nos cotovelos',
      'Abra os braços em arco até sentir alongamento no peito',
      'Retorne à posição inicial contraindo o peitoral',
      'Mantenha o controle durante todo o movimento'
    ]
  },

  // Back Exercises
  {
    id: 'deadlift',
    name: 'Levantamento Terra',
    category: 'back' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Posicione-se com os pés na largura dos quadris',
      'Segure a barra com pegada pronada, mãos na largura dos ombros',
      'Mantenha o peito erguido e as costas retas',
      'Levante a barra estendendo quadris e joelhos simultaneamente',
      'Termine em pé com ombros para trás'
    ]
  },
  {
    id: 'pull-ups',
    name: 'Barra Fixa',
    category: 'back' as MuscleGroup,
    type: 'compound',
    equipment: ['pull-up-bar'],
    difficulty: 'intermediate',
    instructions: [
      'Pendure-se na barra com pegada pronada',
      'Puxe o corpo para cima até o queixo passar da barra',
      'Desça controladamente até extensão completa dos braços',
      'Mantenha o core contraído durante o movimento',
      'Evite balançar o corpo'
    ]
  },
  {
    id: 'barbell-rows',
    name: 'Remada Curvada',
    category: 'back' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Segure a barra com pegada pronada',
      'Incline o tronco para frente mantendo as costas retas',
      'Puxe a barra em direção ao abdômen',
      'Contraia as escápulas no topo do movimento',
      'Desça a barra controladamente'
    ]
  },

  // Leg Exercises
  {
    id: 'squat',
    name: 'Agachamento',
    category: 'legs' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell', 'squat-rack'],
    difficulty: 'beginner',
    instructions: [
      'Posicione a barra nos trapézios superiores',
      'Pés na largura dos ombros, dedos ligeiramente para fora',
      'Desça flexionando quadris e joelhos simultaneamente',
      'Desça até as coxas ficarem paralelas ao chão',
      'Suba empurrando o chão com os pés'
    ]
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'legs' as MuscleGroup,
    type: 'compound',
    equipment: ['leg-press-machine'],
    difficulty: 'beginner',
    instructions: [
      'Sente-se no leg press com as costas apoiadas',
      'Posicione os pés na plataforma na largura dos ombros',
      'Desça até formar ângulo de 90 graus nos joelhos',
      'Empurre a plataforma de volta à posição inicial',
      'Mantenha o controle durante todo o movimento'
    ]
  },

  // Shoulder Exercises
  {
    id: 'overhead-press',
    name: 'Desenvolvimento Militar',
    category: 'shoulders' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Segure a barra na altura dos ombros',
      'Pés na largura dos quadris, core contraído',
      'Empurre a barra diretamente para cima',
      'Estenda completamente os braços acima da cabeça',
      'Desça a barra controladamente até os ombros'
    ]
  },
  {
    id: 'lateral-raises',
    name: 'Elevação Lateral',
    category: 'shoulders' as MuscleGroup,
    type: 'isolation',
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    instructions: [
      'Segure halteres ao lado do corpo',
      'Levante os braços lateralmente até a altura dos ombros',
      'Mantenha uma ligeira flexão nos cotovelos',
      'Desça controladamente à posição inicial',
      'Evite usar impulso'
    ]
  },

  // Arm Exercises
  {
    id: 'barbell-curls',
    name: 'Rosca Direta',
    category: 'arms' as MuscleGroup,
    type: 'isolation',
    equipment: ['barbell'],
    difficulty: 'beginner',
    instructions: [
      'Segure a barra com pegada supinada',
      'Mantenha os cotovelos próximos ao corpo',
      'Flexione os braços elevando a barra',
      'Contraia o bíceps no topo do movimento',
      'Desça a barra controladamente'
    ]
  },
  {
    id: 'tricep-dips',
    name: 'Mergulho em Paralelas',
    category: 'arms' as MuscleGroup,
    type: 'compound',
    equipment: ['parallel-bars'],
    difficulty: 'intermediate',
    instructions: [
      'Apoie-se nas paralelas com braços estendidos',
      'Desça o corpo flexionando os cotovelos',
      'Desça até sentir alongamento no peito',
      'Empurre o corpo de volta à posição inicial',
      'Mantenha o tronco ligeiramente inclinado'
    ]
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Supino Inclinado com Halteres',
    category: 'chest' as MuscleGroup,
    type: 'compound',
    equipment: ['dumbbells', 'incline-bench'],
    difficulty: 'beginner',
    instructions: [
      'Ajuste o banco entre 30 e 45 graus',
      'Comece com os halteres na altura do peito',
      'Empurre para cima sem bater os halteres no topo',
      'Desça devagar, controlando a carga'
    ]
  },
  {
    id: 'push-ups',
    name: 'Flexão de Braço',
    category: 'chest' as MuscleGroup,
    type: 'compound',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Mãos um pouco mais afastadas que os ombros',
      'Corpo alinhado da cabeça aos calcanhares',
      'Desça até o peito quase tocar o chão',
      'Empurre o chão sem perder o alinhamento'
    ]
  },
  {
    id: 'lat-pulldown',
    name: 'Puxada Frontal',
    category: 'back' as MuscleGroup,
    type: 'compound',
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Pegada um pouco mais larga que os ombros',
      'Peito aberto e tronco levemente inclinado',
      'Puxe a barra até a altura do queixo',
      'Retorne devagar, sem soltar o peso'
    ]
  },
  {
    id: 'seated-cable-row',
    name: 'Remada Sentada na Polia',
    category: 'back' as MuscleGroup,
    type: 'compound',
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Sente com a coluna neutra e os joelhos levemente flexionados',
      'Puxe o triângulo em direção ao abdômen',
      'Aproxime as escápulas no final do movimento',
      'Estenda os braços com controle'
    ]
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Desenvolvimento com Halteres',
    category: 'shoulders' as MuscleGroup,
    type: 'compound',
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    instructions: [
      'Sentado, com os halteres na altura das orelhas',
      'Empurre para cima até quase estender os cotovelos',
      'Mantenha o abdômen firme',
      'Desça de forma controlada'
    ]
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    category: 'shoulders' as MuscleGroup,
    type: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Polia na altura do rosto com corda',
      'Puxe em direção ao rosto abrindo os cotovelos',
      'Pause por um segundo com as escápulas unidas',
      'Retorne devagar'
    ]
  },
  {
    id: 'triceps-pushdown',
    name: 'Tríceps na Polia',
    category: 'arms' as MuscleGroup,
    type: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Cotovelos colados ao corpo',
      'Estenda os braços até o fim sem mover os ombros',
      'Contraia o tríceps por um segundo',
      'Suba devagar até 90 graus de flexão'
    ]
  },
  {
    id: 'hammer-curl',
    name: 'Rosca Martelo',
    category: 'arms' as MuscleGroup,
    type: 'isolation',
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    instructions: [
      'Palmas voltadas uma para a outra',
      'Cotovelos fixos ao lado do corpo',
      'Suba até a altura dos ombros',
      'Desça sem balançar o tronco'
    ]
  },
  {
    id: 'romanian-deadlift',
    name: 'Levantamento Terra Romeno',
    category: 'legs' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Joelhos levemente flexionados e coluna neutra',
      'Leve o quadril para trás, deslizando a barra pelas coxas',
      'Desça até sentir o posterior alongar',
      'Volte estendendo o quadril, sem hiperestender a lombar'
    ]
  },
  {
    id: 'lunges',
    name: 'Avanço com Halteres',
    category: 'legs' as MuscleGroup,
    type: 'compound',
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    instructions: [
      'Passo largo à frente, tronco ereto',
      'Desça até o joelho de trás quase tocar o chão',
      'Empurre pelo calcanhar da frente para voltar',
      'Alterne as pernas mantendo o equilíbrio'
    ]
  },
  {
    id: 'leg-curl',
    name: 'Mesa Flexora',
    category: 'legs' as MuscleGroup,
    type: 'isolation',
    equipment: ['machine'],
    difficulty: 'beginner',
    instructions: [
      'Ajuste o apoio logo acima dos calcanhares',
      'Flexione os joelhos sem tirar o quadril do banco',
      'Contraia no topo por um segundo',
      'Estenda devagar'
    ]
  },
  {
    id: 'leg-extension',
    name: 'Cadeira Extensora',
    category: 'legs' as MuscleGroup,
    type: 'isolation',
    equipment: ['machine'],
    difficulty: 'beginner',
    instructions: [
      'Ajuste o encosto para os joelhos alinharem com o eixo',
      'Estenda as pernas sem chutar',
      'Pause no topo contraindo o quadríceps',
      'Desça de forma controlada'
    ]
  },
  {
    id: 'calf-raise',
    name: 'Panturrilha em Pé',
    category: 'legs' as MuscleGroup,
    type: 'isolation',
    equipment: ['machine', 'bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Apoie a ponta dos pés em um degrau',
      'Suba o máximo que conseguir',
      'Pause em cima por um segundo',
      'Desça até alongar bem o calcanhar'
    ]
  },
  {
    id: 'hip-thrust',
    name: 'Elevação de Quadril',
    category: 'glutes' as MuscleGroup,
    type: 'compound',
    equipment: ['barbell', 'bench'],
    difficulty: 'beginner',
    instructions: [
      'Costas apoiadas no banco e barra sobre o quadril',
      'Pés firmes, joelhos a 90 graus no topo',
      'Suba o quadril contraindo os glúteos',
      'Desça sem perder a tensão'
    ]
  },
  {
    id: 'plank',
    name: 'Prancha',
    category: 'core' as MuscleGroup,
    type: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Apoie antebraços e pontas dos pés',
      'Corpo reto, sem afundar o quadril',
      'Contraia abdômen e glúteos',
      'Respire normalmente durante o tempo'
    ]
  },
  {
    id: 'cable-crunch',
    name: 'Abdominal na Polia',
    category: 'core' as MuscleGroup,
    type: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    instructions: [
      'Ajoelhado, com a corda junto à cabeça',
      'Flexione o tronco aproximando as costelas do quadril',
      'Não puxe com os braços',
      'Volte devagar mantendo a tensão'
    ]
  }
];

export const exercisesByMuscleGroup = {
  chest: exercises.filter(ex => ex.category === 'chest'),
  back: exercises.filter(ex => ex.category === 'back'),
  shoulders: exercises.filter(ex => ex.category === 'shoulders'),
  arms: exercises.filter(ex => ex.category === 'arms'),
  legs: exercises.filter(ex => ex.category === 'legs'),
  core: exercises.filter(ex => ex.category === 'core'),
  glutes: exercises.filter(ex => ex.category === 'glutes'),
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};

export const getExercisesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Exercise[] => {
  return exercises.filter(exercise => exercise.difficulty === difficulty);
};
