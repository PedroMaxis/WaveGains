import type { UserProfile, CurrentProgram } from '../types';

interface HistoryViewProps {
  user: UserProfile;
  currentProgram: CurrentProgram | null;
}

const HistoryView = ({ }: HistoryViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Histórico de Treinos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Análise completa do seu progresso ao longo do tempo
        </p>
      </div>

      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          Histórico e análises em desenvolvimento.
        </p>
      </div>
    </div>
  );
};

export default HistoryView;
