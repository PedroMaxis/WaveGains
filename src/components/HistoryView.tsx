import { useMemo, useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, Clock, Dumbbell, Trophy } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AppState, CompletedWorkout, CurrentProgram, UserProfile } from '../types';
import { getExerciseById } from '../data/exercises';
import { countDoneSets, formatVolume } from '../utils/stats';

interface HistoryViewProps {
  user: UserProfile;
  currentProgram: CurrentProgram | null;
  onViewChange: (view: AppState['currentView']) => void;
}

const formatDate = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

const WorkoutRow = ({ workout }: { workout: CompletedWorkout }) => {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-lg border border-gray-200 dark:border-dark-700">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-700/50 rounded-lg"
      >
        <div className="min-w-0">
          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{workout.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(workout.date)} · semana {workout.week}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-sm text-gray-600 dark:text-gray-400">
          <span className="hidden sm:inline">{countDoneSets(workout.exercises)} séries</span>
          <span className="hidden sm:inline">{workout.durationMin} min</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatVolume(workout.volume)}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-dark-700 pt-3">
          {workout.exercises.map((ex) => (
            <div key={ex.exerciseId}>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{ex.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {ex.sets
                  .map((s) => (ex.unit === 's' ? `${s.reps}s` : `${s.weight}kg × ${s.reps}`))
                  .join('  ·  ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

const HistoryView = ({ currentProgram, onViewChange }: HistoryViewProps) => {
  const history = currentProgram?.history;
  const records = currentProgram?.personalRecords;

  const stats = useMemo(() => {
    const list = history ?? [];
    return {
      count: list.length,
      volume: list.reduce((sum, w) => sum + w.volume, 0),
      minutes: list.reduce((sum, w) => sum + w.durationMin, 0),
    };
  }, [history]);

  const chartData = useMemo(
    () =>
      (history ?? []).slice(-12).map((w) => ({
        treino: w.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        volume: Math.round(w.volume),
      })),
    [history]
  );

  const sortedRecords = useMemo(
    () => [...(records ?? [])].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [records]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Histórico de Treinos</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Tudo o que você já treinou e seus recordes</p>
      </div>

      {stats.count === 0 ? (
        <div className="card text-center py-12 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nenhum treino registrado ainda</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Finalize seu primeiro treino para ver aqui o volume, a evolução das cargas e seus recordes pessoais.
          </p>
          <button className="btn-primary" onClick={() => onViewChange('workout')}>
            Começar primeiro treino
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card flex items-center gap-4">
              <Dumbbell className="w-8 h-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Treinos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.count}</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <BarChart3 className="w-8 h-8 text-secondary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Volume total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatVolume(stats.volume)}</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tempo treinado</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.floor(stats.minutes / 60)}h {stats.minutes % 60}min
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Volume por treino</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="treino" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  formatter={(v) => [`${v} kg`, 'Volume']}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                />
                <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {sortedRecords.length > 0 && (
            <div className="card">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" /> Recordes pessoais
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-dark-700">
                      <th className="py-2 pr-4 font-medium">Exercício</th>
                      <th className="py-2 pr-4 font-medium">1RM estimado</th>
                      <th className="py-2 pr-4 font-medium">Melhor série</th>
                      <th className="py-2 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900 dark:text-gray-100">
                    {sortedRecords.map((r) => (
                      <tr key={r.exerciseId} className="border-b border-gray-100 dark:border-dark-700/50">
                        <td className="py-2 pr-4">{getExerciseById(r.exerciseId)?.name ?? r.exerciseId}</td>
                        <td className="py-2 pr-4 font-semibold">{r.estimatedMax} kg</td>
                        <td className="py-2 pr-4">
                          {r.weight} kg × {r.reps}
                        </td>
                        <td className="py-2">{formatDate(r.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Treinos realizados</h2>
            <ul className="space-y-2">
              {[...(history ?? [])].reverse().map((w) => (
                <WorkoutRow key={w.id} workout={w} />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryView;
