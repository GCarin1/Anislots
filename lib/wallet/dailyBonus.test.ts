import { describe, it, expect } from 'vitest';
import { canClaimDailyBonus, calculateBonusResult } from './dailyBonus';
import { DAILY_BONUS_AMOUNT } from '@/lib/utils/constants';

describe('canClaimDailyBonus', () => {
  it('deve permitir bônus quando nunca foi coletado', () => {
    const result = canClaimDailyBonus(null, Date.now());
    expect(result.canClaim).toBe(true);
  });

  it('deve permitir bônus após 24 horas', () => {
    const lastBonus = new Date('2025-06-15T10:00:00Z').getTime();
    const now = lastBonus + 25 * 60 * 60 * 1000; // 25 horas depois
    const result = canClaimDailyBonus(new Date(lastBonus).toISOString(), now);
    expect(result.canClaim).toBe(true);
  });

  it('deve bloquear bônus antes de 24 horas', () => {
    const lastBonus = new Date('2025-06-15T10:00:00Z').getTime();
    const now = lastBonus + 12 * 60 * 60 * 1000; // 12 horas depois
    const result = canClaimDailyBonus(new Date(lastBonus).toISOString(), now);
    expect(result.canClaim).toBe(false);
    expect(result.nextBonusAt).toBeDefined();
  });

  it('deve bloquear bônus exatamente em 24 horas (boundary)', () => {
    const lastBonus = new Date('2025-06-15T10:00:00Z').getTime();
    const now = lastBonus + 24 * 60 * 60 * 1000 - 1; // 1ms antes das 24h
    const result = canClaimDailyBonus(new Date(lastBonus).toISOString(), now);
    expect(result.canClaim).toBe(false);
  });

  it('deve permitir bônus exatamente no limite de 24 horas', () => {
    const lastBonus = new Date('2025-06-15T10:00:00Z').getTime();
    const now = lastBonus + 24 * 60 * 60 * 1000; // exatamente 24h
    const result = canClaimDailyBonus(new Date(lastBonus).toISOString(), now);
    expect(result.canClaim).toBe(true);
  });

  it('deve retornar nextBonusAt correto quando bloqueado', () => {
    const lastBonusDate = new Date('2025-06-15T10:00:00Z');
    const now = lastBonusDate.getTime() + 6 * 60 * 60 * 1000; // 6h depois
    const result = canClaimDailyBonus(lastBonusDate.toISOString(), now);

    expect(result.canClaim).toBe(false);
    const expected = new Date(lastBonusDate.getTime() + 24 * 60 * 60 * 1000).toISOString();
    expect(result.nextBonusAt).toBe(expected);
  });
});

describe('calculateBonusResult', () => {
  it('deve calcular novo saldo corretamente', () => {
    const result = calculateBonusResult(10000);
    expect(result.newBalance).toBe(10000 + DAILY_BONUS_AMOUNT);
    expect(result.bonusAmount).toBe(DAILY_BONUS_AMOUNT);
  });

  it('deve funcionar com saldo zero', () => {
    const result = calculateBonusResult(0);
    expect(result.newBalance).toBe(DAILY_BONUS_AMOUNT);
    expect(result.bonusAmount).toBe(DAILY_BONUS_AMOUNT);
  });

  it('deve funcionar com saldo grande', () => {
    const result = calculateBonusResult(999999);
    expect(result.newBalance).toBe(999999 + DAILY_BONUS_AMOUNT);
  });
});
