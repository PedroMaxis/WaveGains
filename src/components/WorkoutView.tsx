import type { UserProfile, CurrentProgram } from '../types';

interface WorkoutViewProps {
  user: UserProfile;
  currentProgram: CurrentProgram | null;
}

const WorkoutView = ({ }: WorkoutViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Treino de Hoje
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Execute seu treino com acompanhamento em tempo real
        </p>
      </div>

      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          Interface de treino em desenvolvimento.
        </p>
      </div>
    </div>
  );
};

export default WorkoutView;
