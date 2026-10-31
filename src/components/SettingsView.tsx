import { useRef, useState } from 'react';
import { Download, Moon, RotateCcw, Sun, Upload } from 'lucide-react';
import type { CurrentProgram, UserProfile } from '../types';
import { exportState } from '../utils/storage';

interface SettingsViewProps {
  user: UserProfile;
  currentProgram: CurrentProgram | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateUser: (changes: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => void;
  onImport: (text: string) => boolean;
  onReset: () => void;
}

const SESSION_OPTIONS = [
  { value: 37, label: '30–45 minutos' },
  { value: 52, label: '45–60 minutos' },
  { value: 75, label: '60–90 minutos' },
  { value: 105, label: 'Mais de 90 minutos' },
];

const SettingsView = ({
  user,
  currentProgram,
  isDarkMode,
  onToggleDarkMode,
  onUpdateUser,
  onImport,
  onReset,
}: SettingsViewProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    const json = exportState({ isDarkMode, user, currentProgram });
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `wavegains-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ kind: 'ok', text: 'Backup baixado.' });
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const ok = onImport(await file.text());
    setMessage(
      ok
        ? { kind: 'ok', text: 'Backup importado com sucesso.' }
        : { kind: 'error', text: 'Arquivo inválido: use um backup exportado pelo WaveGains.' }
    );
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Perfil, aparência e seus dados</p>
      </div>

      <section className="card space-y-4" aria-labelledby="perfil">
        <h2 id="perfil" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Perfil
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome</span>
            <input
              className="input-field mt-1"
              value={user.name}
              maxLength={40}
              onChange={(e) => onUpdateUser({ name: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Peso corporal (kg)</span>
            <input
              className="input-field mt-1"
              type="number"
              min={30}
              max={250}
              value={user.bodyWeight}
              onChange={(e) => onUpdateUser({ bodyWeight: Math.max(0, parseFloat(e.target.value) || 0) })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dias de treino por semana</span>
            <select
              className="input-field mt-1"
              value={user.weeklyAvailability}
              onChange={(e) => onUpdateUser({ weeklyAvailability: parseInt(e.target.value, 10) })}
            >
              {[2, 3, 4, 5, 6].map((d) => (
                <option key={d} value={d}>
                  {d} dias
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempo por treino</span>
            <select
              className="input-field mt-1"
              value={user.preferences.timePerSession}
              onChange={(e) =>
                onUpdateUser({
                  preferences: { ...user.preferences, timePerSession: parseInt(e.target.value, 10) },
                })
              }
            >
              {SESSION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs text-gray-500">
          Dias por semana e tempo por treino mudam a divisão e a quantidade de exercícios dos próximos treinos.
        </p>
      </section>

      <section className="card" aria-labelledby="aparencia">
        <h2 id="aparencia" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Aparência
        </h2>
        <button type="button" onClick={onToggleDarkMode} className="btn-secondary flex items-center gap-2">
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDarkMode ? 'Usar tema claro' : 'Usar tema escuro'}
        </button>
      </section>

      <section className="card space-y-4" aria-labelledby="dados">
        <h2 id="dados" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Seus dados
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tudo fica salvo somente neste navegador. Exporte um backup para guardar ou levar para outro dispositivo.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar backup
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" /> Importar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {message && (
          <p
            role="status"
            className={`text-sm ${message.kind === 'ok' ? 'text-secondary-700 dark:text-secondary-400' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-700 dark:text-gray-300">Apagar perfil, programa e histórico?</span>
              <button className="text-red-600 font-medium hover:underline" onClick={onReset}>
                Sim, apagar tudo
              </button>
              <button className="text-gray-500 hover:underline" onClick={() => setConfirmReset(false)}>
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 text-sm text-red-600 hover:underline"
            >
              <RotateCcw className="w-4 h-4" /> Apagar todos os dados e recomeçar
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
