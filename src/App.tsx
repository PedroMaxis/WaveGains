import { useEffect } from 'react';
import { useAppState } from './hooks';

// Components
import Onboarding from './components/Onboarding.tsx';
import Dashboard from './components/Dashboard.tsx';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import ProgramView from './components/ProgramView.tsx';
import WorkoutView from './components/WorkoutView.tsx';
import HistoryView from './components/HistoryView.tsx';
import CalculatorsView from './components/CalculatorsView.tsx';
import SettingsView from './components/SettingsView.tsx';

function App() {
  const { state, updateView, toggleDarkMode, completeOnboarding } = useAppState();

  useEffect(() => {
    // Apply dark mode class to document
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Show onboarding if user hasn't completed it
  if (state.isOnboarding || !state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800">
        <Onboarding onComplete={completeOnboarding} />
      </div>
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      {/* Sidebar */}
      <Sidebar 
        currentView={state.currentView}
        onViewChange={updateView}
        user={state.user}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          user={state.user}
          isDarkMode={state.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          currentProgram={state.currentProgram}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {state.currentView === 'dashboard' && (
            <Dashboard 
              user={state.user}
              currentProgram={state.currentProgram}
              onViewChange={updateView}
            />
          )}
          
          {state.currentView === 'program' && (
            <ProgramView 
              user={state.user}
              currentProgram={state.currentProgram}
            />
          )}
          
          {state.currentView === 'workout' && (
            <WorkoutView 
              user={state.user}
              currentProgram={state.currentProgram}
            />
          )}
          
          {state.currentView === 'history' && (
            <HistoryView 
              user={state.user}
              currentProgram={state.currentProgram}
            />
          )}
          
          {state.currentView === 'calculators' && (
            <CalculatorsView />
          )}
          
          {state.currentView === 'settings' && (
            <SettingsView 
              user={state.user}
              isDarkMode={state.isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}
        </main>
      </div>
      
      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-900 dark:text-gray-100">Carregando...</span>
          </div>
        </div>
      )}
      
      {/* Error Toast */}
      {state.error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{state.error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
