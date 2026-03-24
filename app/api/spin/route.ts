import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { spin, resolveBonusRound } from '@/lib/slot/engine';
import { z } from 'zod';

const SpinSchema = z.object({
  bet_amount: z.number().int().min(10).max(10000),
  waifu_theme: z.string().min(1).max(50),
  nonce: z.number().int(),
  is_bonus_resolution: z.boolean().optional(),
  bonus_choice: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  bonus_spin_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = SpinSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { bet_amount, waifu_theme, nonce, is_bonus_resolution, bonus_choice } = parsed.data;
    const secret = process.env.RNG_SECRET_SEED!;

    const { data: jackpotData } = await supabase
      .from('jackpot')
      .select('current_amount')
      .eq('id', 1)
      .single();

    const currentJackpot = jackpotData?.current_amount ?? 50000;
    const jackpotContribution = Math.floor(
      bet_amount * parseFloat(process.env.JACKPOT_INCREMENT_RATE || '0.01'),
    );

    let result;
    let bonusReward = null;

    if (is_bonus_resolution && bonus_choice !== undefined) {
      bonusReward = resolveBonusRound(bonus_choice, bet_amount, secret, nonce);
      result = {
        symbols: [] as string[][],
        paylinesWon: [],
        scatterCount: 0,
        isBonusRound: false,
        isJackpot: false,
        payout: bonusReward.payout,
        multiplier: bonusReward.reward.type === 'multiplier' ? bonusReward.reward.value : 0,
        totalSymbols: [] as string[],
      };
    } else {
      result = spin(secret, nonce, bet_amount);
    }

    const jackpotAmount = result.isJackpot ? currentJackpot : 0;

    const { data: rpcResult, error: rpcError } = await supabase.rpc('process_spin', {
      p_user_id: user.id,
      p_bet_amount: is_bonus_resolution ? 0 : bet_amount,
      p_waifu_theme: waifu_theme,
      p_result_symbols: JSON.stringify(result.totalSymbols),
      p_paylines_won: JSON.stringify(result.paylinesWon),
      p_payout: result.payout,
      p_multiplier: result.multiplier,
      p_is_bonus: result.isBonusRound,
      p_bonus_choice: bonus_choice ?? null,
      p_bonus_reward: bonusReward ? JSON.stringify(bonusReward.reward) : null,
      p_is_jackpot: result.isJackpot,
      p_jackpot_amount: jackpotAmount,
      p_jackpot_contribution: is_bonus_resolution ? 0 : jackpotContribution,
    });

    if (rpcError) {
      console.error('[spin] RPC error:', rpcError);
      if (rpcError.message.includes('Insufficient balance')) {
        return Response.json({ error: 'Saldo insuficiente' }, { status: 400 });
      }
      return Response.json({ error: 'Erro ao processar spin' }, { status: 500 });
    }

    if (result.isJackpot) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      await supabase.from('chat_messages').insert({
        username: 'Sistema',
        message: `🎰🎉 ${profile?.username} ganhou o JACKPOT de ${currentJackpot.toLocaleString()} moedas!`,
        is_system: true,
        room: 'global',
      });
    }

    return Response.json({
      success: true,
      symbols: result.symbols,
      paylines_won: result.paylinesWon,
      scatter_count: result.scatterCount,
      is_bonus_round: result.isBonusRound,
      is_jackpot: result.isJackpot,
      jackpot_amount: jackpotAmount,
      payout: result.payout,
      multiplier: result.multiplier,
      bonus_reward: bonusReward?.reward ?? null,
      new_balance: rpcResult.new_balance,
      spin_id: rpcResult.spin_id,
    });
  } catch (err) {
    console.error('[spin] Unexpected error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
