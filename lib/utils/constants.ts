export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'AniSlots';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0';

export const MIN_BET = Number(process.env.NEXT_PUBLIC_MIN_BET ?? 10);
export const MAX_BET = Number(process.env.NEXT_PUBLIC_MAX_BET ?? 10000);
export const JACKPOT_SEED = Number(process.env.NEXT_PUBLIC_JACKPOT_SEED ?? 50000);

export const CRYPTO_ENABLED = process.env.NEXT_PUBLIC_CRYPTO_ENABLED === 'true';
export const CHAT_ENABLED = process.env.NEXT_PUBLIC_CHAT_ENABLED !== 'false';
export const JACKPOT_ENABLED = process.env.NEXT_PUBLIC_JACKPOT_ENABLED !== 'false';
export const BONUS_ROUND_ENABLED = process.env.NEXT_PUBLIC_BONUS_ROUND_ENABLED !== 'false';

export const BET_STEPS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000] as const;

export const DAILY_BONUS_AMOUNT = 5000;
export const WELCOME_BONUS = 10000;
export const CHAT_MESSAGE_MAX_LENGTH = 200;
export const CHAT_HISTORY_LIMIT = 50;
