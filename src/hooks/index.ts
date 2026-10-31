import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserProfile, CurrentProgram, AppState, OnboardingData, CompletedWorkout } from '../types';
import { evaluateQuizResults } from '../data/quiz';
import { getProgramById } from '../data/programs';
import { loadState, saveState, parseImport, clearAll } from '../utils/storage';
import { syncProgramPosition } from '../utils/program';
import { applyPersonalRecords, progressMetricsFrom } from '../utils/stats';

// Main app state hook
const prefersDark = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export const useAppState = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    const program = saved?.currentProgram
      ? syncProgramPosition(saved.currentProgram, getProgramById(saved.currentProgram.programId))
      : null;
    return {
      currentView: 'dashboard',
      isOnboarding: !saved?.user,
      isDarkMode: saved?.isDarkMode ?? prefersDark(),
      user: saved?.user ?? null,
      currentProgram: program,
      selectedDate: new Date(),
      isLoading: false,
      error: null,
    };
  });

  // Salva no navegador sempre que algo relevante muda
  useEffect(() => {
    saveState({
      isDarkMode: state.isDarkMode,
      user: state.user,
      currentProgram: state.currentProgram,
    });
  }, [state.isDarkMode, state.user, state.currentProgram]);

  // Mensagens de erro somem sozinhas
  useEffect(() => {
    if (!state.error) return;
    const t = window.setTimeout(() => setState(prev => ({ ...prev, error: null })), 5000);
    return () => window.clearTimeout(t);
  }, [state.error]);

  const updateView = useCallback((view: AppState['currentView']) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const setUser = useCallback((user: UserProfile | null) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const setCurrentProgram = useCallback((program: CurrentProgram | null) => {
    setState(prev => ({ ...prev, currentProgram: program }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const updateUser = useCallback((changes: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => {
    setState(prev => (prev.user ? { ...prev, user: { ...prev.user, ...changes } } : prev));
  }, []);

  const completeOnboarding = useCallback((onboardingData: OnboardingData) => {
    const evaluation = evaluateQuizResults(onboardingData.answers);
    const program = getProgramById(evaluation.recommendedProgram);
    const answerOf = (id: string) => onboardingData.answers.find(a => a.questionId === id)?.answer;

    const userProfile: UserProfile = {
      id: crypto.randomUUID(),
      name: (answerOf('name') as string)?.trim() || 'Usuário',
      level: evaluation.level,
      experienceMonths: evaluation.experienceMonths,
      weeklyAvailability: evaluation.weeklyAvailability,
      goals: (answerOf('goals') as string[]) || [],
      preferences: {
        preferredSplit: (answerOf('training-split') as string) || '',
        availableEquipment: (answerOf('equipment') as string[]) || [],
        timePerSession: getSessionTimeInMinutes(answerOf('session-duration') as string)
      },
      bodyWeight: (answerOf('body-weight') as number) || 70,
      createdAt: new Date()
    };

    if (!program) {
      setState(prev => ({ ...prev, error: 'Não foi possível montar seu programa. Tente novamente.' }));
      return;
    }

    const currentProgram: CurrentProgram = {
      id: crypto.randomUUID(),
      userId: userProfile.id,
      programId: program.id,
      currentWeek: 1,
      currentPhase: program.phases[0].id,
      currentMesocycle: 1,
      startDate: new Date(),
      workouts: [],
      history: [],
      personalRecords: [],
      progressMetrics: {
        totalVolume: [],
        averageIntensity: [],
        workoutsCompleted: 0,
        totalWorkouts: program.duration * userProfile.weeklyAvailability,
        strengthGains: {}
      }
    };

    setState(prev => ({
      ...prev,
      user: userProfile,
      currentProgram,
      isOnboarding: false,
      currentView: 'dashboard'
    }));
  }, []);

  /** Registra um treino concluído e atualiza recordes e métricas. Devolve os exercícios com recorde novo. */
  const completeWorkout = useCallback((workout: CompletedWorkout): string[] => {
    let broken: string[] = [];
    setState(prev => {
      if (!prev.currentProgram) return prev;
      const prs = applyPersonalRecords(prev.currentProgram.personalRecords, workout);
      broken = prs.broken;
      const program: CurrentProgram = {
        ...prev.currentProgram,
        history: [...prev.currentProgram.history, workout],
        personalRecords: prs.records,
      };
      program.progressMetrics = progressMetricsFrom(program);
      return { ...prev, currentProgram: program };
    });
    return broken;
  }, []);

  /** Importa um backup; devolve false se o arquivo for inválido */
  const importData = useCallback((text: string): boolean => {
    const data = parseImport(text);
    if (!data || !data.user) return false;
    setState(prev => ({
      ...prev,
      user: data.user,
      currentProgram: data.currentProgram,
      isDarkMode: data.isDarkMode,
      isOnboarding: false,
      currentView: 'dashboard',
    }));
    return true;
  }, []);

  const resetAll = useCallback(() => {
    clearAll();
    setState(prev => ({
      ...prev,
      user: null,
      currentProgram: null,
      isOnboarding: true,
      currentView: 'dashboard',
    }));
  }, []);

  return {
    state,
    updateView,
    toggleDarkMode,
    setUser,
    setCurrentProgram,
    setLoading,
    setError,
    updateUser,
    completeOnboarding,
    completeWorkout,
    importData,
    resetAll
  };
};

// Cronômetro de descanso: baseado em horário de término, então não "atrasa" com a aba em segundo plano
export const useTimer = (onFinish?: () => void) => {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [initialTime, setInitialTime] = useState(0);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    if (endAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [endAt]);

  const timeLeft = endAt === null ? 0 : Math.max(0, Math.ceil((endAt - now) / 1000));
  const isRunning = endAt !== null && timeLeft > 0;

  useEffect(() => {
    if (endAt !== null && timeLeft === 0) {
      setEndAt(null);
      finishRef.current?.();
    }
  }, [endAt, timeLeft]);

  const startTimer = useCallback((seconds: number) => {
    const t = Date.now();
    setNow(t);
    setInitialTime(seconds);
    setEndAt(t + seconds * 1000);
  }, []);

  const resetTimer = useCallback(() => {
    setEndAt(null);
    setInitialTime(0);
  }, []);

  const addTime = useCallback((seconds: number) => {
    setEndAt(prev => (prev === null ? prev : prev + seconds * 1000));
    setInitialTime(prev => prev + seconds);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return {
    timeLeft,
    isRunning,
    progress: initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0,
    startTimer,
    resetTimer,
    addTime,
    formatted: `${mins}:${secs.toString().padStart(2, '0')}`
  };
};

// Helper function
const getSessionTimeInMinutes = (answer: string): number => {
  if (answer?.includes('30-45')) return 37;
  if (answer?.includes('45-60')) return 52;
  if (answer?.includes('60-90')) return 75;
  if (answer?.includes('Mais de 90')) return 105;
  return 60;
};
