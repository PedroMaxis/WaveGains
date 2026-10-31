import { Suspense, lazy, useEffect, useState } from 'react';
import { useAppState } from './hooks';
import { workoutsThisWeek } from './utils/stats';

// Tela de entrada e estrutura ficam no pacote principal; as demais telas carregam sob demanda
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ProgramView = lazy(() => import('./components/ProgramView'));
const WorkoutView = lazy(() => import('./components/WorkoutView'));
const HistoryView = lazy(() => import('./components/HistoryView'));
const CalculatorsView = lazy(() => import('./components/CalculatorsView'));
const SettingsView = lazy(() => import('./components/SettingsView'));

const ViewFallback = () => (
  <div className="flex items-center justify-center py-24" role="status" aria-label="Carregando">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
  </div>
);

function App() {
  const {
    state,
    updateView,
    toggleDarkMode,
    updateUser,
    completeOnboarding,
    completeWorkout,
    importData,
    resetAll,
  } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.isDarkMode);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', state.isDarkMode ? '#0f172a' : '#f9fafb');
  }, [state.isDarkMode]);

  const changeView = (view: typeof state.currentView) => {
    updateView(view);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  // Fecha o menu mobile com Esc
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  if (state.isOnboarding || !state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800">
        <Onboarding onComplete={completeOnboarding} />
      </div>
    );
  }

  const { user, currentProgram } = state;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar
        currentView={state.currentView}
        onViewChange={changeView}
        user={user}
        weeklyDone={workoutsThisWeek(currentProgram?.history ?? [])}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          isDarkMode={state.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          currentProgram={currentProgram}
          onOpenMenu={() => setMenuOpen(true)}
          onViewChange={changeView}
        />

        <main className="flex-1 p-4 sm:p-6">
          <Suspense fallback={<ViewFallback />}>
            {state.currentView === 'dashboard' && (
              <Dashboard user={user} currentProgram={currentProgram} onViewChange={changeView} />
            )}
            {state.currentView === 'program' && <ProgramView user={user} currentProgram={currentProgram} />}
            {state.currentView === 'workout' && (
              <WorkoutView
                user={user}
                currentProgram={currentProgram}
                onComplete={completeWorkout}
                onViewChange={changeView}
              />
            )}
            {state.currentView === 'history' && (
              <HistoryView user={user} currentProgram={currentProgram} onViewChange={changeView} />
            )}
            {state.currentView === 'calculators' && <CalculatorsView />}
            {state.currentView === 'settings' && (
              <SettingsView
                user={user}
                currentProgram={currentProgram}
                isDarkMode={state.isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                onUpdateUser={updateUser}
                onImport={importData}
                onReset={resetAll}
              />
            )}
          </Suspense>
        </main>
      </div>

      {state.error && (
        <div
          role="alert"
          className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up"
        >
          {state.error}
        </div>
      )}
    </div>
  );
}

export default App;
