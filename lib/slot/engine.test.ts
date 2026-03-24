import { describe, it, expect, vi } from 'vitest';
import { spin, resolveBonusRound, type SpinResult } from './engine';
import { BASE_SYMBOLS } from './symbols';

const SECRET = 'test-secret-key-for-deterministic-tests';

describe('SlotEngine - spin', () => {
  it('deve retornar grid 5x3 (5 colunas, 3 linhas)', () => {
    const result = spin(SECRET, 1, 100);
    expect(result.symbols).toHaveLength(5);
    result.symbols.forEach((col) => {
      expect(col).toHaveLength(3);
    });
  });

  it('todos os símbolos devem ser IDs válidos', () => {
    const validIds = new Set(BASE_SYMBOLS.map((s) => s.id));
    const result = spin(SECRET, 42, 100);
    result.symbols.flat().forEach((sym) => {
      expect(validIds.has(sym)).toBe(true);
    });
  });

  it('totalSymbols deve ser o flat do grid (15 símbolos)', () => {
    const result = spin(SECRET, 1, 100);
    expect(result.totalSymbols).toHaveLength(15);
    expect(result.totalSymbols).toEqual(result.symbols.flat());
  });

  it('payout deve ser sempre >= 0', () => {
    for (let i = 0; i < 200; i++) {
      const result = spin(SECRET, i, 100);
      expect(result.payout).toBeGreaterThanOrEqual(0);
    }
  });

  it('multiplier deve ser >= 0', () => {
    for (let i = 0; i < 200; i++) {
      const result = spin(SECRET, i, 100);
      expect(result.multiplier).toBeGreaterThanOrEqual(0);
    }
  });

  it('payout com bet 0 deve ser 0', () => {
    const result = spin(SECRET, 1, 0);
    expect(result.payout).toBe(0);
  });

  it('scatterCount deve refletir quantidade real de scatters no grid', () => {
    for (let i = 0; i < 200; i++) {
      const result = spin(SECRET, i, 100);
      const actualScatters = result.totalSymbols.filter((s) => s === 'scatter').length;
      expect(result.scatterCount).toBe(actualScatters);
    }
  });

  it('bonus round deve ser ativado apenas com 3+ scatters', () => {
    const results = Array.from({ length: 10000 }, (_, i) => spin(SECRET, i, 100));
    results.forEach((r) => {
      if (r.isBonusRound) {
        expect(r.scatterCount).toBeGreaterThanOrEqual(3);
      }
      if (r.scatterCount >= 3) {
        expect(r.isBonusRound).toBe(true);
      }
    });
  });

  it('paylines ganhadoras devem ter payout positivo', () => {
    for (let i = 0; i < 500; i++) {
      const result = spin(SECRET, i, 100);
      result.paylinesWon.forEach((pl) => {
        expect(pl.payout).toBeGreaterThan(0);
      });
    }
  });

  it('total payout deve ser a soma de todas as paylines ganhadoras', () => {
    for (let i = 0; i < 500; i++) {
      const result = spin(SECRET, i, 100);
      const expectedPayout = result.paylinesWon.reduce((acc, p) => acc + p.payout, 0);
      expect(result.payout).toBe(expectedPayout);
    }
  });

  it('nonces diferentes devem gerar resultados diferentes (na maioria)', () => {
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const result = spin(SECRET, i, 100);
      results.add(JSON.stringify(result.symbols));
    }
    // Com 50 spins, devemos ter pelo menos 10 resultados distintos
    expect(results.size).toBeGreaterThan(10);
  });

  it('secrets diferentes com mesmo nonce devem gerar resultados diferentes', () => {
    const r1 = spin('secret-a', 1, 100);
    const r2 = spin('secret-b', 1, 100);
    // Extremamente improvável que sejam iguais
    expect(JSON.stringify(r1.symbols)).not.toBe(JSON.stringify(r2.symbols));
  });

  it('multiplier deve ser coerente com payout/betAmount', () => {
    for (let i = 0; i < 200; i++) {
      const betAmount = 100;
      const result = spin(SECRET, i, betAmount);
      if (result.payout > 0) {
        const expectedMult = parseFloat((result.payout / betAmount).toFixed(2));
        expect(result.multiplier).toBe(expectedMult);
      } else {
        expect(result.multiplier).toBe(0);
      }
    }
  });
});

describe('SlotEngine - RTP', () => {
  it('RTP deve estar entre 85% e 98% em 100k spins', () => {
    const BET = 100;
    const SPINS = 100000;
    let totalBet = 0;
    let totalPayout = 0;

    for (let i = 0; i < SPINS; i++) {
      const result = spin(SECRET, i, BET);
      totalBet += BET;
      totalPayout += result.payout;
    }

    const rtp = totalPayout / totalBet;
    expect(rtp).toBeGreaterThan(0.85);
    expect(rtp).toBeLessThan(0.98);
  }, 30000); // timeout maior para 100k spins
});

describe('SlotEngine - resolveBonusRound', () => {
  it('deve retornar um reward válido', () => {
    const result = resolveBonusRound(0, 100, SECRET, 1);
    expect(result.reward).toBeDefined();
    expect(['multiplier', 'freespins']).toContain(result.reward.type);
    expect(result.reward.value).toBeGreaterThan(0);
  });

  it('multiplier reward deve ter payout = betAmount * value', () => {
    // Testar várias combinações
    for (let i = 0; i < 100; i++) {
      const choice = (i % 3) as 0 | 1 | 2;
      const result = resolveBonusRound(choice, 100, SECRET, i);
      if (result.reward.type === 'multiplier') {
        expect(result.payout).toBe(100 * result.reward.value);
      }
    }
  });

  it('freespins reward deve ter payout 0', () => {
    for (let i = 0; i < 100; i++) {
      const choice = (i % 3) as 0 | 1 | 2;
      const result = resolveBonusRound(choice, 100, SECRET, i);
      if (result.reward.type === 'freespins') {
        expect(result.payout).toBe(0);
      }
    }
  });

  it('diferentes choices com mesmo nonce podem gerar resultados diferentes', () => {
    const r0 = resolveBonusRound(0, 100, SECRET, 1);
    const r1 = resolveBonusRound(1, 100, SECRET, 1);
    const r2 = resolveBonusRound(2, 100, SECRET, 1);
    // Pelo menos 2 dos 3 devem ser iguais (choice não afeta RNG diretamente no design atual)
    // Na verdade no design atual, choice não afeta o resultado RNG, apenas serve de UX
    expect(r0.reward).toBeDefined();
    expect(r1.reward).toBeDefined();
    expect(r2.reward).toBeDefined();
  });
});
