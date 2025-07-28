import type { OneRMResult, RPEConversion, VolumeCalculation } from '../types';

// 1RM Calculation formulas
export const calculateOneRM = (weight: number, reps: number, formula: 'epley' | 'brzycki' | 'lombardi' | 'mayhew' = 'epley'): OneRMResult => {
  let estimated1RM: number;
  
  switch (formula) {
    case 'epley':
      estimated1RM = weight * (1 + reps / 30);
      break;
    case 'brzycki':
      estimated1RM = weight / (1.0278 - 0.0278 * reps);
      break;
    case 'lombardi':
      estimated1RM = weight * Math.pow(reps, 0.10);
      break;
    case 'mayhew':
      estimated1RM = 100 * weight / (52.2 + 41.9 * Math.exp(-0.055 * reps));
      break;
    default:
      estimated1RM = weight * (1 + reps / 30);
  }
  
  // Generate percentage table
  const percentages: { [key: number]: number } = {};
  for (let i = 50; i <= 100; i += 5) {
    percentages[i] = Math.round((estimated1RM * i / 100) * 2.5) / 2.5; // Round to nearest 2.5kg
  }
  
  return {
    estimated1RM: Math.round(estimated1RM * 2.5) / 2.5,
    formula,
    percentages
  };
};

// RPE to Percentage conversions based on research
export const rpeConversions: RPEConversion[] = [
  { rpe: 10, percentage: 100, description: 'Máximo esforço - nenhuma rep adicional' },
  { rpe: 9.5, percentage: 97, description: 'Talvez mais meia rep' },
  { rpe: 9, percentage: 93, description: 'Definitivamente mais 1 rep' },
  { rpe: 8.5, percentage: 90, description: 'Talvez mais 1-2 reps' },
  { rpe: 8, percentage: 86, description: 'Definitivamente mais 2 reps' },
  { rpe: 7.5, percentage: 83, description: 'Talvez mais 2-3 reps' },
  { rpe: 7, percentage: 79, description: 'Definitivamente mais 3 reps' },
  { rpe: 6.5, percentage: 76, description: 'Talvez mais 3-4 reps' },
  { rpe: 6, percentage: 72, description: 'Definitivamente mais 4 reps' },
  { rpe: 5, percentage: 65, description: 'Mais 5+ reps possíveis' },
];

export const getRPEFromPercentage = (percentage: number): RPEConversion => {
  const closest = rpeConversions.reduce((prev, current) => 
    Math.abs(current.percentage - percentage) < Math.abs(prev.percentage - percentage) ? current : prev
  );
  return closest;
};

export const getPercentageFromRPE = (rpe: number): RPEConversion => {
  const exact = rpeConversions.find(conv => conv.rpe === rpe);
  if (exact) return exact;
  
  // Interpolate if exact RPE not found
  const lower = rpeConversions.filter(conv => conv.rpe < rpe).pop();
  const upper = rpeConversions.find(conv => conv.rpe > rpe);
  
  if (!lower || !upper) return rpeConversions[0];
  
  const ratio = (rpe - lower.rpe) / (upper.rpe - lower.rpe);
  const interpolatedPercentage = lower.percentage + (upper.percentage - lower.percentage) * ratio;
  
  return {
    rpe,
    percentage: Math.round(interpolatedPercentage),
    description: `Aproximadamente ${Math.round(interpolatedPercentage)}% do 1RM`
  };
};

// Volume calculations
export const calculateVolume = (sets: number, reps: number, weight: number): VolumeCalculation => {
  const totalSets = sets;
  const totalReps = sets * reps;
  const totalWeight = totalReps * weight;
  const volumeLoad = totalWeight; // Simple volume load calculation
  const averageIntensity = weight; // This would need 1RM for true percentage
  
  return {
    totalSets,
    totalReps,
    totalWeight,
    volumeLoad,
    averageIntensity
  };
};

// Progressive overload calculators
export const calculateNextWeight = (currentWeight: number, reps: number, targetReps: number): number => {
  // If completed all reps, increase weight by 2.5-5kg depending on exercise
  if (reps >= targetReps) {
    const increment = currentWeight >= 100 ? 5 : 2.5; // Larger increments for heavier weights
    return currentWeight + increment;
  }
  return currentWeight;
};

// Fatigue and recovery calculations
export const calculateRecoveryTime = (volume: number, intensity: number): number => {
  // Base recovery time in hours
  const baseRecovery = 24;
  
  // Volume factor (higher volume = longer recovery)
  const volumeFactor = Math.min(volume / 1000, 2); // Cap at 2x
  
  // Intensity factor (higher intensity = longer recovery)
  const intensityFactor = Math.min(intensity / 100, 1.5); // Cap at 1.5x
  
  return Math.round(baseRecovery * (1 + volumeFactor * 0.5 + intensityFactor * 0.3));
};

// Periodization calculations
export const calculatePhaseProgression = (currentWeek: number, totalWeeks: number, startIntensity: number, endIntensity: number): number => {
  const progressRatio = currentWeek / totalWeeks;
  return Math.round(startIntensity + (endIntensity - startIntensity) * progressRatio);
};

export const calculateVolumeProgression = (currentWeek: number, totalWeeks: number, startVolume: number, endVolume: number): number => {
  const progressRatio = currentWeek / totalWeeks;
  return Math.round(startVolume + (endVolume - startVolume) * progressRatio);
};

// Strength standards for comparison
export const strengthStandards = {
  beginner: { squat: 1.0, bench: 0.75, deadlift: 1.25 },
  intermediate: { squat: 1.5, bench: 1.0, deadlift: 1.75 },
  advanced: { squat: 2.0, bench: 1.5, deadlift: 2.25 },
  elite: { squat: 2.5, bench: 1.75, deadlift: 2.75 }
};

export const getStrengthLevel = (exercise: 'squat' | 'bench' | 'deadlift', weight: number, bodyWeight: number): string => {
  const ratio = weight / bodyWeight;
  
  if (ratio >= strengthStandards.elite[exercise]) return 'Elite';
  if (ratio >= strengthStandards.advanced[exercise]) return 'Avançado';
  if (ratio >= strengthStandards.intermediate[exercise]) return 'Intermediário';
  if (ratio >= strengthStandards.beginner[exercise]) return 'Iniciante';
  return 'Novato';
};

// Deload calculations
export const calculateDeloadWeight = (currentWeight: number, deloadPercentage: number = 0.8): number => {
  return Math.round(currentWeight * deloadPercentage * 2.5) / 2.5; // Round to nearest 2.5kg
};

// Training max calculations (used in many programs)
export const calculateTrainingMax = (oneRM: number, percentage: number = 0.9): number => {
  return Math.round(oneRM * percentage * 2.5) / 2.5;
};
