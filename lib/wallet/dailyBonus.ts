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

/**
 * Builds the update payload for the daily bonus claim.
 * Only includes columns guaranteed to exist in the wallets table schema.
 * Excludes `updated_at` to avoid conflicts with DB triggers/defaults.
 */
export function buildBonusUpdatePayload(
  newBalance: number,
  timestamp: string,
): { virtual_coins: number; last_daily_bonus_at: string } {
  return {
    virtual_coins: newBalance,
    last_daily_bonus_at: timestamp,
  };
}

interface WalletRow {
  virtual_coins: number;
  last_daily_bonus_at: string | null;
}

interface ParsedUpdateResult {
  success: boolean;
  wallet: WalletRow | null;
  errorMessage?: string;
}

/**
 * Parses the result of a Supabase update query, handling both
 * `.single()` (returns object) and no `.single()` (returns array) cases,
 * as well as RLS-blocked updates that return 0 rows (PGRST116).
 */
export function parseUpdateResult(
  data: WalletRow | WalletRow[] | null,
  error: { code: string; message: string } | null,
): ParsedUpdateResult {
  if (error) {
    return { success: false, wallet: null, errorMessage: `[${error.code}] ${error.message}` };
  }

  if (!data) {
    return { success: false, wallet: null, errorMessage: 'No data returned' };
  }

  // Handle array response (when not using .single())
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { success: false, wallet: null, errorMessage: 'Update affected 0 rows' };
    }
    return { success: true, wallet: data[0] };
  }

  // Handle single object response
  return { success: true, wallet: data };
}

interface BonusPrepareResult {
  canClaim: boolean;
  payload: { virtual_coins: number; last_daily_bonus_at: string } | null;
  bonusAmount: number;
  balanceBefore: number;
  nextBonusAt?: string;
}

/**
 * Validates cooldown and prepares update payload in a single step.
 * Combines canClaimDailyBonus + calculateBonusResult + buildBonusUpdatePayload.
 */
export function validateAndPrepareBonus(
  currentBalance: number,
  lastDailyBonusAt: string | null,
): BonusPrepareResult {
  const check = canClaimDailyBonus(lastDailyBonusAt, Date.now());

  if (!check.canClaim) {
    return {
      canClaim: false,
      payload: null,
      bonusAmount: 0,
      balanceBefore: currentBalance,
      nextBonusAt: check.nextBonusAt,
    };
  }

  const { newBalance, bonusAmount } = calculateBonusResult(currentBalance);
  const payload = buildBonusUpdatePayload(newBalance, new Date().toISOString());

  return {
    canClaim: true,
    payload,
    bonusAmount,
    balanceBefore: currentBalance,
  };
}
