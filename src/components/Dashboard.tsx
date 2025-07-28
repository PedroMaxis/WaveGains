import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  Clock,
  Zap,
  BarChart3,
  Play
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { CurrentProgram, AppState } from '../types';
import { getProgramById } from '../data/programs';

interface DashboardProps {
  currentProgram: CurrentProgram | null;
  onViewChange: (view: AppState['currentView']) => void;
}

const Dashboard = ({ currentProgram, onViewChange }: DashboardProps) => {
  const program = currentProgram ? getProgramById(currentProgram.programId) : null;
  
  // Mock data for charts
  const volumeData = [
    { week: 'Sem 1', volume: 4500 },
    { week: 'Sem 2', volume: 4800 },
    { week: 'Sem 3', volume: 5200 },
    { week: 'Sem 4', volume: 4900 },
    { week: 'Sem 5', volume: 5500 },
    { week: 'Sem 6', volume: 5800 },
  ];

  const strengthData = [
    { exercise: 'Supino', current: 80, previous: 75 },
    { exercise: 'Agachamento', current: 100, previous: 95 },
    { exercise: 'Terra', current: 120, previous: 115 },
    { exercise: 'Militar', current: 60, previous: 57.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do seu progresso e próximas atividades
          </p>
        </div>
        
        <button
          onClick={() => onViewChange('workout')}
          className="btn-primary flex items-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>Iniciar Treino</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Treinos Completos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentProgram?.progressMetrics.workoutsCompleted || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +12% esta semana
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Volume Semanal
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                5.2k kg
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +8% vs semana anterior
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Semana Atual
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentProgram?.currentWeek || 1}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progresso</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {program ? `${currentProgram?.currentWeek}/${program.duration}` : '0/0'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                style={{ 
                  width: program ? `${((currentProgram?.currentWeek || 1) / program.duration) * 100}%` : '0%' 
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Próximo Treino
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Hoje
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Push (Peito, Ombros, Tríceps)
            </p>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      {program && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Programa Atual
            </h2>
            <button
              onClick={() => onViewChange('program')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Ver detalhes →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {program.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {program.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {program.duration} semanas
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {program.phases.length} fases
                  </span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Fases do Programa
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {program.phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      currentProgram?.currentPhase === phase.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">
                        {phase.name}
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {phase.duration} semanas
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {phase.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Volume Semanal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#1D4ED8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Strength Progress */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Progresso de Força
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={strengthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="exercise" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="previous" fill="#6B7280" name="Anterior" />
              <Bar dataKey="current" fill="#22C55E" name="Atual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onViewChange('calculators')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Calculadora 1RM
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calculate seu máximo
              </p>
            </div>
          </button>

          <button
            onClick={() => onViewChange('history')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Ver Histórico
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise completa
              </p>
            </div>
          </button>

          <button
            onClick={() => onViewChange('program')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Ajustar Programa
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Personalizar treino
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
