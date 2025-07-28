import { Moon, Sun, Bell, Settings, User } from 'lucide-react';
import type { UserProfile, CurrentProgram } from '../types';

interface HeaderProps {
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentProgram: CurrentProgram | null;
}

const Header = ({ user, isDarkMode, onToggleDarkMode, currentProgram }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Welcome message and program info */}
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Olá, {user.name}! 👋
          </h1>
          {currentProgram && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getCurrentProgramStatus(currentProgram)}
            </p>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {getLevelText(user.level)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const getCurrentProgramStatus = (program: CurrentProgram): string => {
  return `Semana ${program.currentWeek} • Mesociclo ${program.currentMesocycle}`;
};

const getLevelText = (level: string): string => {
  const levels = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado'
  };
  return levels[level as keyof typeof levels] || 'Iniciante';
};

export default Header;
