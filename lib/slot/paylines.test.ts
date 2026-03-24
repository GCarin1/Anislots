import { describe, it, expect } from 'vitest';
import { PAYLINES } from './paylines';

describe('Paylines', () => {
  it('deve ter exatamente 20 paylines', () => {
    expect(PAYLINES).toHaveLength(20);
  });

  it('cada payline deve ter exatamente 5 posições (colunas)', () => {
    PAYLINES.forEach((line, idx) => {
      expect(line).toHaveLength(5);
    });
  });

  it('cada posição deve ser 0, 1 ou 2 (linhas válidas)', () => {
    PAYLINES.forEach((line) => {
      line.forEach((pos) => {
        expect(pos).toBeGreaterThanOrEqual(0);
        expect(pos).toBeLessThanOrEqual(2);
      });
    });
  });

  it('primeira payline deve ser a linha do meio [1,1,1,1,1]', () => {
    expect(PAYLINES[0]).toEqual([1, 1, 1, 1, 1]);
  });

  it('deve incluir linhas horizontais (topo, meio, baixo)', () => {
    expect(PAYLINES).toContainEqual([0, 0, 0, 0, 0]);
    expect(PAYLINES).toContainEqual([1, 1, 1, 1, 1]);
    expect(PAYLINES).toContainEqual([2, 2, 2, 2, 2]);
  });
});
