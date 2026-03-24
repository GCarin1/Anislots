export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  selected_waifu: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  virtual_coins: number;
  total_deposited: number;
  total_withdrawn: number;
  last_daily_bonus_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpinRecord {
  id: string;
  user_id: string;
  waifu_theme: string;
  bet_amount: number;
  result_symbols: string[];
  paylines_won: unknown[];
  payout: number;
  multiplier: number;
  is_bonus_round: boolean;
  bonus_choice: number | null;
  bonus_reward: { type: string; value: number } | null;
  is_jackpot: boolean;
  jackpot_amount: number | null;
  balance_before: number;
  balance_after: number;
  created_at: string;
}

export interface Jackpot {
  id: number;
  current_amount: number;
  total_contributed: number;
  last_winner_id: string | null;
  last_winner_username: string | null;
  last_won_at: string | null;
  last_won_amount: number | null;
  updated_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  waifu_theme: string;
  total_winnings: number;
  biggest_win: number;
  total_spins: number;
  jackpots_won: number;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string | null;
  username: string;
  avatar_url: string | null;
  message: string;
  is_system: boolean;
  waifu_theme: string | null;
  room: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}
