// Placeholder for Supabase generated types
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > lib/supabase/types.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          selected_waifu: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          selected_waifu?: string;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
          selected_waifu?: string;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          virtual_coins: number;
          total_deposited: number;
          total_withdrawn: number;
          last_daily_bonus_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          virtual_coins?: number;
        };
        Update: {
          virtual_coins?: number;
          last_daily_bonus_at?: string | null;
          updated_at?: string;
        };
      };
      spins: {
        Row: {
          id: string;
          user_id: string;
          waifu_theme: string;
          bet_amount: number;
          result_symbols: Json;
          paylines_won: Json;
          payout: number;
          multiplier: number;
          is_bonus_round: boolean;
          bonus_choice: number | null;
          bonus_reward: Json | null;
          is_jackpot: boolean;
          jackpot_amount: number | null;
          balance_before: number;
          balance_after: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          waifu_theme: string;
          bet_amount: number;
          result_symbols: Json;
          paylines_won?: Json;
          payout?: number;
          multiplier?: number;
          is_bonus_round?: boolean;
          bonus_choice?: number | null;
          bonus_reward?: Json | null;
          is_jackpot?: boolean;
          jackpot_amount?: number | null;
          balance_before: number;
          balance_after: number;
        };
        Update: Record<string, never>;
      };
      jackpot: {
        Row: {
          id: number;
          current_amount: number;
          total_contributed: number;
          last_winner_id: string | null;
          last_winner_username: string | null;
          last_won_at: string | null;
          last_won_amount: number | null;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: {
          current_amount?: number;
          total_contributed?: number;
          last_winner_id?: string | null;
          last_winner_username?: string | null;
          last_won_at?: string | null;
          last_won_amount?: number | null;
          updated_at?: string;
        };
      };
      leaderboard: {
        Row: {
          user_id: string;
          username: string;
          avatar_url: string | null;
          waifu_theme: string;
          total_winnings: number;
          biggest_win: number;
          total_spins: number;
          jackpots_won: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          username: string;
          avatar_url?: string | null;
          waifu_theme?: string;
          total_winnings?: number;
          biggest_win?: number;
          total_spins?: number;
          jackpots_won?: number;
        };
        Update: {
          total_winnings?: number;
          biggest_win?: number;
          total_spins?: number;
          jackpots_won?: number;
          waifu_theme?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string | null;
          username: string;
          avatar_url: string | null;
          message: string;
          is_system: boolean;
          waifu_theme: string | null;
          room: string;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          username: string;
          avatar_url?: string | null;
          message: string;
          is_system?: boolean;
          waifu_theme?: string | null;
          room?: string;
        };
        Update: Record<string, never>;
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          balance_before: number;
          balance_after: number;
          reference_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          amount: number;
          balance_before: number;
          balance_after: number;
          reference_id?: string | null;
          description?: string | null;
        };
        Update: Record<string, never>;
      };
    };
    Functions: {
      process_spin: {
        Args: {
          p_user_id: string;
          p_bet_amount: number;
          p_waifu_theme: string;
          p_result_symbols: Json;
          p_paylines_won: Json;
          p_payout: number;
          p_multiplier: number;
          p_is_bonus: boolean;
          p_bonus_choice: number | null;
          p_bonus_reward: Json | null;
          p_is_jackpot: boolean;
          p_jackpot_amount: number;
          p_jackpot_contribution: number;
        };
        Returns: Json;
      };
    };
  };
}
