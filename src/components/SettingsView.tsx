import type { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const SettingsView = ({ }: SettingsViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Personalize sua experiência no aplicativo
        </p>
      </div>

      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          Configurações em desenvolvimento.
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
