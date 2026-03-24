import { describe, it, expect } from 'vitest';
import { BASE_SYMBOLS, buildWeightedPool, type SymbolId } from './symbols';

describe('Symbols', () => {
  it('deve ter 9 símbolos base definidos', () => {
    expect(BASE_SYMBOLS).toHaveLength(9);
  });

  it('total de weight deve ser exatamente 100', () => {
    const totalWeight = BASE_SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    expect(totalWeight).toBe(100);
  });

  it('deve ter exatamente 1 wild e 1 scatter', () => {
    const wilds = BASE_SYMBOLS.filter((s) => s.isWild);
    const scatters = BASE_SYMBOLS.filter((s) => s.isScatter);
    expect(wilds).toHaveLength(1);
    expect(scatters).toHaveLength(1);
  });

  it('wild deve ter o menor peso (mais raro)', () => {
    const wild = BASE_SYMBOLS.find((s) => s.isWild)!;
    const minWeight = Math.min(...BASE_SYMBOLS.map((s) => s.weight));
    expect(wild.weight).toBe(minWeight);
  });

  it('todos os IDs devem ser únicos', () => {
    const ids = BASE_SYMBOLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('buildWeightedPool', () => {
  it('deve retornar array com tamanho igual ao total de weights', () => {
    const pool = buildWeightedPool(BASE_SYMBOLS);
    expect(pool).toHaveLength(100);
  });

  it('deve conter cada símbolo na quantidade correta do weight', () => {
    const pool = buildWeightedPool(BASE_SYMBOLS);
    for (const symbol of BASE_SYMBOLS) {
      const count = pool.filter((id) => id === symbol.id).length;
      expect(count).toBe(symbol.weight);
    }
  });

  it('deve conter apenas SymbolIds válidos', () => {
    const pool = buildWeightedPool(BASE_SYMBOLS);
    const validIds = new Set(BASE_SYMBOLS.map((s) => s.id));
    pool.forEach((id) => {
      expect(validIds.has(id)).toBe(true);
    });
  });
});
