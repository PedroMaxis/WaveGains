import { describe, expect, it } from 'vitest';
import { exportState, parseImport } from './storage';
import { makeUser } from './fixtures';

describe('backup', () => {
  const state = { isDarkMode: true, user: makeUser(), currentProgram: null };

  it('exporta e importa sem perder dados, recriando as datas', () => {
    const back = parseImport(exportState(state));
    expect(back?.user?.name).toBe('Teste');
    expect(back?.isDarkMode).toBe(true);
    expect(back?.user?.createdAt).toBeInstanceOf(Date);
  });

  it('rejeita lixo, JSON inválido e versões desconhecidas', () => {
    expect(parseImport('não é json')).toBeNull();
    expect(parseImport('{"foo": 1}')).toBeNull();
    expect(parseImport(JSON.stringify({ version: 99, user: null }))).toBeNull();
  });

  it('completa campos que faltam em backups antigos', () => {
    const raw = JSON.stringify({
      version: 1,
      isDarkMode: false,
      user: makeUser(),
      currentProgram: { id: 'p', programId: 'linear-basic', startDate: '2025-01-01T00:00:00.000Z' },
    });
    const back = parseImport(raw);
    expect(back?.currentProgram?.history).toEqual([]);
    expect(back?.currentProgram?.startDate).toBeInstanceOf(Date);
  });
});
