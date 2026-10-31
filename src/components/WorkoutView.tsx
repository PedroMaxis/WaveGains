import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Clock,
  Dumbbell,
  Info,
  Minus,
  Plus,
  Timer,
  Trash2,
  Trophy,
} from 'lucide-react';
import type {
  AppState,
  CompletedWorkout,
  CurrentProgram,
  UserProfile,
  WorkoutDraft,
} from '../types';
import { getProgramById } from '../data/programs';
import { getExerciseById } from '../data/exercises';
import { useTimer } from '../hooks';
import { getProgramPosition } from '../utils/program';
import { buildWorkout } from '../utils/workoutPlan';
import { clearDraft, loadDraft, saveDraft } from '../utils/storage';
import { countDoneSets, formatVolume, workoutVolume } from '../utils/stats';

interface WorkoutViewProps {
  user: UserProfile;
  currentProgram: CurrentProgram | null;
  onComplete: (workout: CompletedWorkout) => string[];
  onViewChange: (view: AppState['currentView']) => void;
}

interface Summary {
  workout: CompletedWorkout;
  records: string[];
}

const beep = () => {
  try {
    const ctx = new window.AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    /* sem áudio disponível */
  }
  navigator.vibrate?.([200, 100, 200]);
};

const formatClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const WorkoutView = ({ user, currentProgram, onComplete, onViewChange }: WorkoutViewProps) => {
  const program = currentProgram ? getProgramById(currentProgram.programId) : undefined;
  const history = currentProgram?.history;

  const position = useMemo(
    () =>
      program && currentProgram ? getProgramPosition(program, currentProgram.startDate) : null,
    [program, currentProgram]
  );

  const freshWorkout = useCallback((): WorkoutDraft | null => {
    if (!position || !history) return null;
    return buildWorkout(user, position.phase, position.week, history);
  }, [user, position, history]);

  const [draft, setDraft] = useState<WorkoutDraft | null>(() => loadDraft() ?? freshWorkout());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [resting, setResting] = useState<string | null>(null);

  const timer = useTimer(() => {
    setResting(null);
    beep();
  });

  // Rascunho: o treino em andamento sobrevive a um recarregamento
  useEffect(() => {
    if (draft && !summary) saveDraft(draft);
  }, [draft, summary]);

  const totals = useMemo(() => {
    if (!draft) return { done: 0, total: 0, volume: 0 };
    const total = draft.exercises.reduce((n, e) => n + e.sets.length, 0);
    return { done: countDoneSets(draft.exercises), total, volume: workoutVolume(draft.exercises) };
  }, [draft]);

  if (!currentProgram || !program || !position) {
    return (
      <div className="card text-gray-600 dark:text-gray-400">
        Você ainda não tem um programa ativo. Refaça o questionário nas configurações.
      </div>
    );
  }

  const updateExercises = (fn: (ex: WorkoutDraft['exercises']) => WorkoutDraft['exercises']) =>
    setDraft((d) => (d ? { ...d, exercises: fn(d.exercises) } : d));

  const patchSet = (exIdx: number, setIdx: number, patch: Partial<{ weight: number; reps: number }>) =>
    updateExercises((list) =>
      list.map((ex, i) =>
        i !== exIdx
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j === setIdx ? { ...s, ...patch } : s)) }
      )
    );

  const toggleSet = (exIdx: number, setIdx: number) => {
    if (!draft) return;
    const ex = draft.exercises[exIdx];
    const willBeDone = !ex.sets[setIdx].done;
    updateExercises((list) =>
      list.map((e, i) =>
        i !== exIdx
          ? e
          : { ...e, sets: e.sets.map((s, j) => (j === setIdx ? { ...s, done: willBeDone } : s)) }
      )
    );
    if (willBeDone) {
      setResting(ex.name);
      timer.startTimer(ex.restTime);
    }
  };

  const addSet = (exIdx: number) =>
    updateExercises((list) =>
      list.map((ex, i) => {
        if (i !== exIdx) return ex;
        const last = ex.sets[ex.sets.length - 1];
        return { ...ex, sets: [...ex.sets, { weight: last?.weight ?? 0, reps: last?.reps ?? 10, done: false }] };
      })
    );

  const removeSet = (exIdx: number) =>
    updateExercises((list) =>
      list.map((ex, i) => (i === exIdx && ex.sets.length > 1 ? { ...ex, sets: ex.sets.slice(0, -1) } : ex))
    );

  const discard = () => {
    clearDraft();
    timer.resetTimer();
    setResting(null);
    setConfirmDiscard(false);
    setDraft(freshWorkout());
  };

  const finish = () => {
    if (!draft || totals.done === 0) return;
    const exercises = draft.exercises
      .map((ex) => ({ ...ex, sets: ex.sets.filter((s) => s.done) }))
      .filter((ex) => ex.sets.length > 0);
    const workout: CompletedWorkout = {
      id: crypto.randomUUID(),
      name: draft.name,
      date: new Date(),
      week: draft.week,
      phaseId: draft.phaseId,
      durationMin: Math.max(1, Math.round((Date.now() - draft.startedAt.getTime()) / 60000)),
      volume: workoutVolume(exercises),
      exercises,
    };
    const brokenIds = onComplete(workout);
    clearDraft();
    timer.resetTimer();
    setResting(null);
    setSummary({
      workout,
      records: brokenIds.map((id) => getExerciseById(id)?.name ?? id),
    });
    setDraft(null);
  };

  /* ----------------------------- Resumo pós-treino ----------------------------- */
  if (summary) {
    const { workout, records } = summary;
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="card text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
            <Check className="w-8 h-8 text-secondary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Treino concluído!</h1>
          <p className="text-gray-600 dark:text-gray-400">{workout.name}</p>

          <dl className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">Volume</dt>
              <dd className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatVolume(workout.volume)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">Séries</dt>
              <dd className="text-xl font-bold text-gray-900 dark:text-gray-100">{countDoneSets(workout.exercises)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">Duração</dt>
              <dd className="text-xl font-bold text-gray-900 dark:text-gray-100">{workout.durationMin} min</dd>
            </div>
          </dl>

          {records.length > 0 && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-left">
              <p className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
                <Trophy className="w-5 h-5" /> Novo recorde pessoal
              </p>
              <ul className="mt-2 text-sm text-amber-900 dark:text-amber-200 list-disc list-inside">
                {records.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button className="btn-secondary" onClick={() => onViewChange('dashboard')}>
              Voltar ao dashboard
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                setSummary(null);
                setDraft(freshWorkout());
              }}
            >
              Ver próximo treino
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!draft) return null;

  const progress = totals.total ? (totals.done / totals.total) * 100 : 0;

  /* ----------------------------- Treino em andamento ----------------------------- */
  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
            Semana {position.week} de {position.totalWeeks} · {position.phase.name}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{draft.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {draft.exercises.length} exercícios · alvo de {position.phase.intensityRange.min}–
            {position.phase.intensityRange.max}% do 1RM
          </p>
        </div>
        <div className="sm:w-64">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>
              {totals.done}/{totals.total} séries
            </span>
            <span>{formatVolume(totals.volume)}</span>
          </div>
          <div
            className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso do treino"
          >
            <div
              className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {position.finished && (
        <div className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-4 text-sm text-primary-900 dark:text-primary-200">
          Você concluiu todas as semanas deste programa. Pode continuar treinando com a última fase ou refazer o
          questionário nas configurações para um novo ciclo.
        </div>
      )}

      <div className="space-y-4">
        {draft.exercises.map((ex, exIdx) => {
          const info = getExerciseById(ex.exerciseId);
          const infoOpen = openInfo === ex.exerciseId;
          const timed = ex.unit === 's';
          return (
            <section key={ex.exerciseId} className="card !p-0 overflow-hidden">
              <header className="flex items-start justify-between gap-3 p-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold flex items-center justify-center">
                    {exIdx + 1}
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">{ex.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ex.targetSets} × {ex.targetReps}
                      {timed ? ' s' : ''} · descanso {formatClock(ex.restTime)}
                    </p>
                  </div>
                </div>
                {info && (
                  <button
                    type="button"
                    onClick={() => setOpenInfo(infoOpen ? null : ex.exerciseId)}
                    aria-expanded={infoOpen}
                    aria-label={`Como executar ${ex.name}`}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    {infoOpen ? <ChevronDown className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </button>
                )}
              </header>

              {infoOpen && info && (
                <ol className="pl-10 pr-6 py-4 text-sm text-gray-700 dark:text-gray-300 list-decimal space-y-1 bg-gray-50 dark:bg-dark-800/60 border-b border-gray-200 dark:border-dark-700">
                  {info.instructions.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}

              <div className="p-4 space-y-2">
                <div className="grid grid-cols-[2rem_1fr_1fr_2.75rem] gap-2 text-xs uppercase tracking-wide text-gray-500 px-1">
                  <span>#</span>
                  <span>Carga (kg)</span>
                  <span>{timed ? 'Tempo (s)' : 'Reps'}</span>
                  <span className="sr-only">Concluir</span>
                </div>
                {ex.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`grid grid-cols-[2rem_1fr_1fr_2.75rem] gap-2 items-center rounded-lg px-1 py-1 transition-colors ${
                      set.done ? 'bg-secondary-50 dark:bg-secondary-900/20' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{setIdx + 1}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.5}
                      value={set.weight || ''}
                      placeholder="0"
                      disabled={timed}
                      aria-label={`Carga da série ${setIdx + 1} de ${ex.name}`}
                      onChange={(e) => patchSet(exIdx, setIdx, { weight: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="input-field !py-1.5 disabled:opacity-40"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={set.reps || ''}
                      placeholder="0"
                      aria-label={`${timed ? 'Segundos' : 'Repetições'} da série ${setIdx + 1} de ${ex.name}`}
                      onChange={(e) => patchSet(exIdx, setIdx, { reps: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                      className="input-field !py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSet(exIdx, setIdx)}
                      aria-pressed={set.done}
                      aria-label={`${set.done ? 'Desmarcar' : 'Concluir'} série ${setIdx + 1} de ${ex.name}`}
                      className={`h-10 rounded-lg flex items-center justify-center border transition-colors ${
                        set.done
                          ? 'bg-secondary-600 border-secondary-600 text-white'
                          : 'border-gray-300 dark:border-dark-600 text-gray-400 hover:border-secondary-500 hover:text-secondary-600'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => addSet(exIdx)}
                    className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Série
                  </button>
                  {ex.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(exIdx)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:underline"
                    >
                      <Minus className="w-4 h-4" /> Série
                    </button>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        {confirmDiscard ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Descartar este treino?</span>
            <button className="text-red-600 font-medium hover:underline" onClick={discard}>
              Sim, descartar
            </button>
            <button className="text-gray-500 hover:underline" onClick={() => setConfirmDiscard(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDiscard(true)}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" /> Descartar treino
          </button>
        )}
        <button
          type="button"
          onClick={finish}
          disabled={totals.done === 0}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Dumbbell className="w-5 h-5" /> Finalizar treino
        </button>
      </div>

      {/* Cronômetro de descanso */}
      {timer.isRunning && (
        <div
          role="timer"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md rounded-xl bg-dark-900 text-white shadow-2xl p-4 animate-slide-up"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Timer className="w-5 h-5 text-secondary-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-400 truncate">Descanso · {resting}</p>
                <p className="text-2xl font-bold tabular-nums">{timer.formatted}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => timer.addTime(15)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              >
                +15s
              </button>
              <button
                type="button"
                onClick={() => {
                  timer.resetTimer();
                  setResting(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-secondary-600 hover:bg-secondary-700 text-sm font-medium"
              >
                Pular
              </button>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-white/10">
            <div className="h-1 rounded-full bg-secondary-400 transition-all" style={{ width: `${timer.progress}%` }} />
          </div>
        </div>
      )}

      <p className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3.5 h-3.5" /> O treino é salvo automaticamente neste navegador; você pode recarregar a
        página sem perder nada.
      </p>
    </div>
  );
};

export default WorkoutView;
