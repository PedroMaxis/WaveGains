import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, CurrentProgram, AppState, OnboardingData } from '../types';
import { evaluateQuizResults } from '../data/quiz';
import { getProgramById } from '../data/programs';

// Main app state hook
export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'dashboard',
    isOnboarding: true,
    isDarkMode: false,
    user: null,
    currentProgram: null,
    selectedDate: new Date(),
    isLoading: false,
    error: null,
  });

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

  const completeOnboarding = useCallback((onboardingData: OnboardingData) => {
    const evaluation = evaluateQuizResults(onboardingData.answers);
    const program = getProgramById(evaluation.recommendedProgram);
    
    const userProfile: UserProfile = {
      id: crypto.randomUUID(),
      name: onboardingData.answers.find(a => a.questionId === 'name')?.answer as string || 'Usuário',
      level: evaluation.level,
      experienceMonths: evaluation.experienceMonths,
      weeklyAvailability: evaluation.weeklyAvailability,
      goals: onboardingData.answers.find(a => a.questionId === 'goals')?.answer as string[] || [],
      preferences: {
        preferredSplit: onboardingData.answers.find(a => a.questionId === 'training-split')?.answer as string || '',
        availableEquipment: onboardingData.answers.find(a => a.questionId === 'equipment')?.answer as string[] || [],
        timePerSession: getSessionTimeInMinutes(onboardingData.answers.find(a => a.questionId === 'session-duration')?.answer as string)
      },
      bodyWeight: onboardingData.answers.find(a => a.questionId === 'body-weight')?.answer as number || 70,
      createdAt: new Date()
    };

    if (program) {
      const currentProgram: CurrentProgram = {
        id: crypto.randomUUID(),
        userId: userProfile.id,
        programId: program.id,
        currentWeek: 1,
        currentPhase: program.phases[0].id,
        currentMesocycle: 1,
        startDate: new Date(),
        workouts: [],
        personalRecords: [],
        progressMetrics: {
          totalVolume: [],
          averageIntensity: [],
          workoutsCompleted: 0,
          totalWorkouts: 0,
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
    }
  }, []);

  return {
    state,
    updateView,
    toggleDarkMode,
    setUser,
    setCurrentProgram,
    setLoading,
    setError,
    completeOnboarding
  };
};

// Progress tracking hook
export const useProgress = () => {
  const [progressData, setProgressData] = useState({
    weeklyVolume: [] as number[],
    strengthProgress: {} as Record<string, number[]>,
    bodyWeightProgress: [] as { date: Date; weight: number }[],
    performanceMetrics: {
      totalWorkouts: 0,
      averageIntensity: 0,
      totalVolume: 0,
      consistencyRate: 0
    }
  });

  const addWorkoutData = useCallback((volume: number, exercises: Record<string, number>) => {
    setProgressData(prev => ({
      ...prev,
      weeklyVolume: [...prev.weeklyVolume, volume],
      strengthProgress: {
        ...prev.strengthProgress,
        ...Object.entries(exercises).reduce((acc, [exerciseId, weight]) => {
          acc[exerciseId] = [...(prev.strengthProgress[exerciseId] || []), weight];
          return acc;
        }, {} as Record<string, number[]>)
      },
      performanceMetrics: {
        ...prev.performanceMetrics,
        totalWorkouts: prev.performanceMetrics.totalWorkouts + 1,
        totalVolume: prev.performanceMetrics.totalVolume + volume
      }
    }));
  }, []);

  const addBodyWeightEntry = useCallback((weight: number) => {
    setProgressData(prev => ({
      ...prev,
      bodyWeightProgress: [
        ...prev.bodyWeightProgress,
        { date: new Date(), weight }
      ]
    }));
  }, []);

  return {
    progressData,
    addWorkoutData,
    addBodyWeightEntry
  };
};

// Timer hook for rest periods
export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    let interval: number;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = useCallback((seconds: number) => {
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    setInitialTime(0);
  }, []);

  const addTime = useCallback((seconds: number) => {
    setTimeLeft(prev => prev + seconds);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    isRunning,
    progress: initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime,
    formatTime: () => formatTime(timeLeft)
  };
};

// Local state management for form data
export const useFormData = <T>(initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when updated
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
  }, [initialData]);

  return {
    data,
    errors,
    updateField,
    setFieldError,
    clearErrors,
    resetForm,
    hasErrors: Object.keys(errors).length > 0
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
