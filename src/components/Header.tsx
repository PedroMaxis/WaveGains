import { Menu, Moon, Settings, Sun } from 'lucide-react';
import type { AppState, CurrentProgram, UserProfile } from '../types';
import { getProgramById } from '../data/programs';
import { getProgramPosition } from '../utils/program';

interface HeaderProps {
  user: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentProgram: CurrentProgram | null;
  onOpenMenu: () => void;
  onViewChange: (view: AppState['currentView']) => void;
}

const LEVEL_TEXT = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };

const programStatus = (program: CurrentProgram | null): string | null => {
  if (!program) return null;
  const def = getProgramById(program.programId);
  if (!def) return null;
  const pos = getProgramPosition(def, program.startDate);
  return `Semana ${pos.week} de ${pos.totalWeeks} · ${pos.phase.name}`;
};

const iconButton =
  'p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors';

const Header = ({ user, isDarkMode, onToggleDarkMode, currentProgram, onOpenMenu, onViewChange }: HeaderProps) => {
  const status = programStatus(currentProgram);
  return (
    <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onOpenMenu} aria-label="Abrir menu" className={`lg:hidden ${iconButton}`}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">Olá, {user.name}! 👋</p>
            {status && <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{status}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Usar tema claro' : 'Usar tema escuro'}
            className={iconButton}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button type="button" onClick={() => onViewChange('settings')} aria-label="Configurações" className={iconButton}>
            <Settings className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{LEVEL_TEXT[user.level] ?? 'Iniciante'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
