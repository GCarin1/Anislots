import { describe, it, expect } from 'vitest';
import { PAYTABLE } from './paytable';
import { BASE_SYMBOLS, type SymbolId } from './symbols';

describe('Paytable', () => {
  it('deve ter entrada para cada símbolo definido', () => {
    for (const symbol of BASE_SYMBOLS) {
      expect(PAYTABLE[symbol.id]).toBeDefined();
    }
  });

  it('wild deve ter os maiores multiplicadores', () => {
    const wildMax = Math.max(...Object.values(PAYTABLE.wild));
    for (const symbol of BASE_SYMBOLS) {
      if (symbol.id === 'wild') continue;
      const symMax = Math.max(...Object.values(PAYTABLE[symbol.id]));
      expect(wildMax).toBeGreaterThanOrEqual(symMax);
    }
  });

  it('todos os multiplicadores devem ser positivos', () => {
    for (const symbol of Object.keys(PAYTABLE) as SymbolId[]) {
      for (const mult of Object.values(PAYTABLE[symbol])) {
        expect(mult).toBeGreaterThan(0);
      }
    }
  });

  it('multiplicadores devem crescer com mais símbolos na linha', () => {
    for (const symbol of Object.keys(PAYTABLE) as SymbolId[]) {
      const entries = Object.entries(PAYTABLE[symbol])
        .map(([count, mult]) => ({ count: Number(count), mult }))
        .sort((a, b) => a.count - b.count);

      for (let i = 1; i < entries.length; i++) {
        expect(entries[i].mult).toBeGreaterThan(entries[i - 1].mult);
      }
    }
  });

  it('scatter deve pagar a partir de 3 (não 2)', () => {
    expect(PAYTABLE.scatter[2]).toBeUndefined();
    expect(PAYTABLE.scatter[3]).toBeDefined();
  });

  it('cherry deve ser o único que paga com 2 símbolos', () => {
    const paysWith2 = (Object.keys(PAYTABLE) as SymbolId[]).filter(
      (id) => id !== 'wild' && PAYTABLE[id][2] !== undefined,
    );
    expect(paysWith2).toEqual(['cherry']);
  });
});
