import { Calendar, Target, TrendingUp, Clock, Award, BarChart3 } from 'lucide-react';
import type { UserProfile, CurrentProgram } from '../types';
import { getProgramById } from '../data/programs';

interface ProgramViewProps {
  user: UserProfile;
  currentProgram: CurrentProgram | null;
}

const ProgramView = ({ user, currentProgram }: ProgramViewProps) => {
  const program = currentProgram ? getProgramById(currentProgram.programId) : null;

  if (!currentProgram || !program) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meu Programa
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Você ainda não possui um programa ativo
          </p>
        </div>

        <div className="card text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Nenhum Programa Ativo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete o onboarding para receber uma recomendação de programa personalizada
          </p>
          <button className="btn-primary">
            Configurar Programa
          </button>
        </div>
      </div>
    );
  }

  const currentPhase = program.phases.find(phase => phase.id === currentProgram.currentPhase);
  const progressPercentage = (currentProgram.currentWeek / program.duration) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meu Programa
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe seu progresso e ajuste seu programa
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 text-primary-600">
            <Calendar className="w-4 h-4" />
            <span>Semana {currentProgram.currentWeek}</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center space-x-1 text-secondary-600">
            <Award className="w-4 h-4" />
            <span>Mesociclo {currentProgram.currentMesocycle}</span>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Program Info */}
        <div className="lg:col-span-2 card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {program.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {program.description}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Progresso Geral</div>
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Semana {currentProgram.currentWeek} de {program.duration}</span>
              <span>{Math.round(progressPercentage)}% completo</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-600 to-secondary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Current Phase */}
          {currentPhase && (
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-primary-800 dark:text-primary-300">
                  Fase Atual: {currentPhase.name}
                </h3>
              </div>
              <p className="text-primary-700 dark:text-primary-400 text-sm mb-3">
                {currentPhase.focus}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-primary-600 font-medium">Volume:</span>
                  <span className="ml-2 text-primary-800 dark:text-primary-300">
                    {currentPhase.volumeLoad === 'high' ? 'Alto' : 
                     currentPhase.volumeLoad === 'moderate' ? 'Moderado' : 'Baixo'}
                  </span>
                </div>
                <div>
                  <span className="text-primary-600 font-medium">Intensidade:</span>
                  <span className="ml-2 text-primary-800 dark:text-primary-300">
                    {currentPhase.intensityRange.min}-{currentPhase.intensityRange.max}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Perfil do Atleta
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nível:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {user.level === 'beginner' ? 'Iniciante' : 
                   user.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Experiência:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {user.experienceMonths} meses
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frequência:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {user.weeklyAvailability}x/semana
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Estatísticas Rápidas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {currentProgram.progressMetrics.workoutsCompleted}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Treinos Completos
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    +12%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Melhoria Média
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {user.preferences.timePerSession}min
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duração Média
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Phases */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Fases do Programa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {program.phases.map((phase, index) => {
            const isActive = currentProgram.currentPhase === phase.id;
            const isCompleted = index < program.phases.findIndex(p => p.id === currentProgram.currentPhase);
            
            return (
              <div
                key={phase.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : isCompleted
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    isActive
                      ? 'text-primary-800 dark:text-primary-300'
                      : isCompleted
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {phase.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-400 text-white'
                  }`}>
                    {phase.duration}sem
                  </span>
                </div>
                
                <p className={`text-sm mb-3 ${
                  isActive
                    ? 'text-primary-700 dark:text-primary-400'
                    : isCompleted
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {phase.focus}
                </p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reps:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {phase.repRanges.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Intensidade:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {phase.intensityRange.min}-{phase.intensityRange.max}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="btn-primary flex-1">
          Ajustar Programa
        </button>
        <button className="btn-secondary flex-1">
          Histórico Detalhado
        </button>
        <button className="btn-secondary flex-1">
          Exportar Dados
        </button>
      </div>
    </div>
  );
};

export default ProgramView;
