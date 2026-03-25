import { describe, it, expect } from 'vitest';
import { canClaimDailyBonus, calculateBonusResult, parseUpdateResult, buildBonusUpdatePayload } from './dailyBonus';
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

describe('parseUpdateResult', () => {
  it('deve retornar sucesso quando data é array com um item', () => {
    const result = parseUpdateResult(
      [{ virtual_coins: 15000, last_daily_bonus_at: '2025-06-15T10:00:00Z' }],
      null,
    );
    expect(result.success).toBe(true);
    expect(result.wallet!.virtual_coins).toBe(15000);
    expect(result.wallet!.last_daily_bonus_at).toBe('2025-06-15T10:00:00Z');
  });

  it('deve retornar sucesso quando data é objeto único', () => {
    const result = parseUpdateResult(
      { virtual_coins: 15000, last_daily_bonus_at: '2025-06-15T10:00:00Z' },
      null,
    );
    expect(result.success).toBe(true);
    expect(result.wallet!.virtual_coins).toBe(15000);
  });

  it('deve retornar falha quando há erro', () => {
    const error = { code: 'PGRST116', message: 'Cannot coerce', details: '', hint: '' };
    const result = parseUpdateResult(null, error);
    expect(result.success).toBe(false);
    expect(result.wallet).toBeNull();
    expect(result.errorMessage).toContain('PGRST116');
  });

  it('deve retornar falha quando data é array vazio', () => {
    const result = parseUpdateResult([], null);
    expect(result.success).toBe(false);
    expect(result.wallet).toBeNull();
  });

  it('deve retornar falha quando data é null', () => {
    const result = parseUpdateResult(null, null);
    expect(result.success).toBe(false);
    expect(result.wallet).toBeNull();
  });
});

describe('buildBonusUpdatePayload', () => {
  it('deve conter apenas virtual_coins e last_daily_bonus_at', () => {
    const payload = buildBonusUpdatePayload(15000, '2025-06-15T10:00:00Z');

    expect(Object.keys(payload)).toHaveLength(2);
    expect(payload.virtual_coins).toBe(15000);
    expect(payload.last_daily_bonus_at).toBe('2025-06-15T10:00:00Z');
  });

  it('não deve incluir updated_at', () => {
    const payload = buildBonusUpdatePayload(15000, '2025-06-15T10:00:00Z');

    expect(payload).not.toHaveProperty('updated_at');
  });
});
