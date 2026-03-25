import { DAILY_BONUS_AMOUNT } from '@/lib/utils/constants';

const HOURS_24_MS = 24 * 60 * 60 * 1000;

interface ClaimCheck {
  canClaim: boolean;
  nextBonusAt?: string;
}

export function canClaimDailyBonus(
  lastDailyBonusAt: string | null,
  now: number,
): ClaimCheck {
  if (!lastDailyBonusAt) {
    return { canClaim: true };
  }

  const lastBonusTime = new Date(lastDailyBonusAt).getTime();
  const elapsed = now - lastBonusTime;

  if (elapsed >= HOURS_24_MS) {
    return { canClaim: true };
  }

  return {
    canClaim: false,
    nextBonusAt: new Date(lastBonusTime + HOURS_24_MS).toISOString(),
  };
}

interface BonusResult {
  newBalance: number;
  bonusAmount: number;
}

export function calculateBonusResult(currentBalance: number): BonusResult {
  return {
    newBalance: currentBalance + DAILY_BONUS_AMOUNT,
    bonusAmount: DAILY_BONUS_AMOUNT,
  };
}
