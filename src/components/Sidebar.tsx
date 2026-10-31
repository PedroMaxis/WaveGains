import { useState } from 'react';
import {
  Calculator,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  LayoutDashboard,
  Settings,
  Target,
  X,
} from 'lucide-react';
import type { AppState, UserProfile } from '../types';

interface SidebarProps {
  currentView: AppState['currentView'];
  onViewChange: (view: AppState['currentView']) => void;
  user: UserProfile;
  /** Treinos concluídos nesta semana */
  weeklyDone: number;
  /** Menu aberto no mobile */
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-primary-600' },
  { id: 'program', label: 'Meu Programa', icon: Target, color: 'text-secondary-600' },
  { id: 'workout', label: 'Treino Hoje', icon: Dumbbell, color: 'text-orange-600' },
  { id: 'history', label: 'Histórico', icon: Calendar, color: 'text-purple-600' },
  { id: 'calculators', label: 'Calculadoras', icon: Calculator, color: 'text-blue-600' },
  { id: 'settings', label: 'Configurações', icon: Settings, color: 'text-gray-600' },
] as const;

const LEVELS = {
  beginner: { text: 'Iniciante', color: 'bg-green-500' },
  intermediate: { text: 'Intermediário', color: 'bg-yellow-500' },
  advanced: { text: 'Avançado', color: 'bg-red-500' },
};

const Sidebar = ({ currentView, onViewChange, user, weeklyDone, isOpen, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const level = LEVELS[user.level] ?? LEVELS.beginner;
  const goal = Math.max(1, user.weeklyAvailability);
  const pct = Math.min(100, Math.round((weeklyDone / goal) * 100));

  return (
    <>
      {/* Fundo escurecido no mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        aria-label="Menu principal"
        className={`bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col transition-all duration-300
          fixed inset-y-0 left-0 z-40 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">WaveGains</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Periodização Inteligente</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
              className="hidden lg:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4" aria-label="Seções">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onViewChange(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.label}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-600' : item.color}`} />
                    <span className={`font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-4 border-t border-gray-200 dark:border-dark-700 ${isCollapsed ? 'lg:hidden' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${level.color}`} />
                <p className="text-xs text-gray-600 dark:text-gray-400">{level.text}</p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progresso semanal</span>
              <span>
                {Math.min(weeklyDone, goal)}/{goal}
              </span>
            </div>
            <div
              className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Treinos da semana"
            >
              <div
                className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
