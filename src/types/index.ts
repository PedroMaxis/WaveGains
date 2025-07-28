// Types for user profile and experience level
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  name: string;
  level: ExperienceLevel;
  experienceMonths: number;
  weeklyAvailability: number; // days per week
  goals: string[];
  preferences: {
    preferredSplit: string;
    availableEquipment: string[];
    timePerSession: number; // minutes
  };
  bodyWeight: number;
  createdAt: Date;
}

// Periodization models
export type PeriodizationModel = 'linear' | 'undulating' | 'block' | 'conjugate';

export interface PeriodizationProgram {
  id: string;
  name: string;
  model: PeriodizationModel;
  description: string;
  duration: number; // weeks
  phases: Phase[];
  recommendedFor: ExperienceLevel[];
}

export interface Phase {
  id: string;
  name: string;
  duration: number; // weeks
  focus: string;
  volumeLoad: 'low' | 'moderate' | 'high';
  intensityRange: {
    min: number; // percentage of 1RM
    max: number;
  };
  repRanges: number[];
  characteristics: string[];
}

// Exercise and workout structure
export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  type: 'compound' | 'isolation';
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  videoUrl?: string;
}

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'arms' 
  | 'legs' 
  | 'core' 
  | 'glutes';

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number | string; // can be range like "8-10"
  weight?: number;
  rpe?: number; // Rate of Perceived Exertion
  restTime: number; // seconds
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  day: number; // day of the week (1-7)
  exercises: WorkoutSet[];
  estimatedDuration: number; // minutes
  focus: MuscleGroup[];
}

// Current program state
export interface CurrentProgram {
  id: string;
  userId: string;
  programId: string;
  currentWeek: number;
  currentPhase: string;
  currentMesocycle: number;
  startDate: Date;
  workouts: Workout[];
  personalRecords: PersonalRecord[];
  progressMetrics: ProgressMetrics;
}

export interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  date: Date;
  estimatedMax: number;
}

export interface ProgressMetrics {
  totalVolume: number[];
  averageIntensity: number[];
  workoutsCompleted: number;
  totalWorkouts: number;
  strengthGains: {
    [exerciseId: string]: {
      initial: number;
      current: number;
      improvement: number;
    };
  };
}

// Calculators
export interface OneRMResult {
  estimated1RM: number;
  formula: 'epley' | 'brzycki' | 'lombardi' | 'mayhew';
  percentages: {
    [key: number]: number;
  };
}

export interface RPEConversion {
  rpe: number;
  percentage: number;
  description: string;
}

export interface VolumeCalculation {
  totalSets: number;
  totalReps: number;
  totalWeight: number;
  volumeLoad: number;
  averageIntensity: number;
}

// UI State
export interface AppState {
  currentView: 'dashboard' | 'program' | 'workout' | 'history' | 'calculators' | 'settings';
  isOnboarding: boolean;
  isDarkMode: boolean;
  user: UserProfile | null;
  currentProgram: CurrentProgram | null;
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
}

// Onboarding quiz
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'range' | 'input';
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[] | number;
}

export interface OnboardingData {
  answers: QuizAnswer[];
  recommendedProgram: string;
  estimatedLevel: ExperienceLevel;
}
