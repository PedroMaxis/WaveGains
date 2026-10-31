import { useMemo } from 'react';
import { Award, BarChart3, Calendar, Clock, Play, Target, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AppState, CurrentProgram, UserProfile } from '../types';
import { getProgramById } from '../data/programs';
import { getProgramPosition } from '../utils/program';
import { getNextSplitDay } from '../utils/workoutPlan';
import {
  formatVolume,
  strengthProgress,
  volumeChange,
  weeklyVolumeSeries,
  workoutsThisWeek,
} from '../utils/stats';

interface DashboardProps {
  user: UserProfile;
  currentProgram: CurrentProgram | null;
  onViewChange: (view: AppState['currentView']) => void;
}

const tooltipStyle = {
  backgroundColor: '#1F2937',
  border: 'none',
  borderRadius: '8px',
  color: '#F3F4F6',
};

const QUICK_ACTIONS = [
  {
    view: 'calculators',
    icon: Zap,
    title: 'Calculadora 1RM',
    text: 'Calcule seu máximo',
    box: 'bg-blue-100 dark:bg-blue-900/30',
    color: 'text-blue-600',
  },
  {
    view: 'history',
    icon: BarChart3,
    title: 'Ver histórico',
    text: 'Análise completa',
    box: 'bg-purple-100 dark:bg-purple-900/30',
    color: 'text-purple-600',
  },
  {
    view: 'program',
    icon: Target,
    title: 'Meu programa',
    text: 'Fases e progressão',
    box: 'bg-green-100 dark:bg-green-900/30',
    color: 'text-green-600',
  },
] as const;

const EmptyChart = ({ text }: { text: string }) => (
  <div className="h-[260px] flex items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400 px-6 border border-dashed border-gray-300 dark:border-dark-600 rounded-lg">
    {text}
  </div>
);

const Dashboard = ({ user, currentProgram, onViewChange }: DashboardProps) => {
  const program = currentProgram ? getProgramById(currentProgram.programId) : null;
  const history = useMemo(() => currentProgram?.history ?? [], [currentProgram]);
  const position = program && currentProgram ? getProgramPosition(program, currentProgram.startDate) : null;

  const volumeData = useMemo(() => weeklyVolumeSeries(history, 8), [history]);
  const strengthData = useMemo(() => strengthProgress(history), [history]);
  const weekVolume = volumeData[volumeData.length - 1]?.volume ?? 0;
  const change = volumeChange(history);
  const doneThisWeek = workoutsThisWeek(history);
  const nextWorkout = getNextSplitDay(user, history);
  const hasData = history.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visão geral do seu progresso e próximas atividades</p>
        </div>
        <button onClick={() => onViewChange('workout')} className="btn-primary flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          <span>{hasData ? 'Iniciar treino' : 'Começar primeiro treino'}</span>
        </button>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Treinos na semana</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {doneThisWeek}
                <span className="text-base font-medium text-gray-500"> / {user.weeklyAvailability}</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {history.length} {history.length === 1 ? 'treino' : 'treinos'} no total
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volume da semana</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatVolume(weekVolume)}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {change === null ? (
              <span className="text-gray-500">Sem semana anterior para comparar</span>
            ) : (
              <>
                {change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {change >= 0 ? '+' : ''}
                  {change}% vs semana anterior
                </span>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Semana do programa</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {position?.week ?? 1}
                <span className="text-base font-medium text-gray-500"> / {position?.totalWeeks ?? '–'}</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{position?.phase.name}</p>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                style={{ width: position ? `${(position.week / position.totalWeeks) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Próximo treino</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{nextWorkout.name}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">~{user.preferences.timePerSession} min</p>
        </div>
      </div>

      {/* Programa atual */}
      {program && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Programa atual</h2>
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
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{program.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{program.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" /> {program.duration} {program.duration === 1 ? 'semana' : 'semanas'}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-gray-500" /> {program.phases.length} fases
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Fases do programa</h4>
              <div className="grid grid-cols-1 gap-3">
                {program.phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      position?.phase.id === phase.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{phase.name}</h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{phase.duration} {phase.duration === 1 ? 'semana' : 'semanas'}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{phase.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Volume semanal (últimas 8 semanas)</h3>
          {hasData ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="week" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip formatter={(v) => [`${v} kg`, 'Volume']} contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 7, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart text="O volume (carga × repetições) aparece aqui depois do seu primeiro treino." />
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Progresso de força</h3>
          <p className="text-xs text-gray-500 mb-3">1RM estimado: primeiro treino vs melhor atual (kg)</p>
          {strengthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="exercise" stroke="#6B7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="inicial" fill="#6B7280" name="Inicial" />
                <Bar dataKey="atual" fill="#22C55E" name="Atual" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart text="Treine o mesmo exercício em pelo menos duas sessões para ver sua evolução de força." />
          )}
        </div>
      </div>

      {/* Atalhos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Ações rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(({ view, icon: Icon, title, text, box, color }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${box}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
