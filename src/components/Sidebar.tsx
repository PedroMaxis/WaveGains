import { 
  LayoutDashboard, 
  Calendar, 
  Dumbbell, 
  Calculator, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';
import { useState } from 'react';
import type { UserProfile, AppState } from '../types';

interface SidebarProps {
  currentView: AppState['currentView'];
  onViewChange: (view: AppState['currentView']) => void;
  user: UserProfile;
}

const Sidebar = ({ currentView, onViewChange, user }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-primary-600'
    },
    {
      id: 'program' as const,
      label: 'Meu Programa',
      icon: Target,
      color: 'text-secondary-600'
    },
    {
      id: 'workout' as const,
      label: 'Treino Hoje',
      icon: Dumbbell,
      color: 'text-orange-600'
    },
    {
      id: 'history' as const,
      label: 'Histórico',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      id: 'calculators' as const,
      label: 'Calculadoras',
      icon: Calculator,
      color: 'text-blue-600'
    },
    {
      id: 'settings' as const,
      label: 'Configurações',
      icon: Settings,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className={`bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  WaveGains
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Periodização Inteligente
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : item.color}`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info at bottom */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user.name}
              </p>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getLevelColor(user.level)}`} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {getLevelText(user.level)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progresso Semanal</span>
              <span>3/4</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full w-3/4 transition-all duration-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getLevelColor = (level: string): string => {
  const colors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500'
  };
  return colors[level as keyof typeof colors] || 'bg-gray-500';
};

const getLevelText = (level: string): string => {
  const levels = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado'
  };
  return levels[level as keyof typeof levels] || 'Iniciante';
};

export default Sidebar;
