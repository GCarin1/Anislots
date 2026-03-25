import { createServerClient } from '@/lib/supabase/server';
import { canClaimDailyBonus, calculateBonusResult } from '@/lib/wallet/dailyBonus';

export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch current wallet
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('virtual_coins, last_daily_bonus_at')
    .eq('user_id', user.id)
    .single();

  if (walletError || !wallet) {
    return Response.json({ error: 'Wallet not found' }, { status: 404 });
  }

  // Validate cooldown using pure function
  const check = canClaimDailyBonus(wallet.last_daily_bonus_at, Date.now());
  if (!check.canClaim) {
    return Response.json(
      { error: 'Bônus já coletado hoje', next_bonus_at: check.nextBonusAt },
      { status: 429 },
    );
  }

  // Calculate new balance
  const { newBalance, bonusAmount } = calculateBonusResult(wallet.virtual_coins);
  const now = new Date().toISOString();

  // Update wallet and verify it succeeded
  const { data: updatedWallet, error: updateError } = await supabase
    .from('wallets')
    .update({
      virtual_coins: newBalance,
      last_daily_bonus_at: now,
      updated_at: now,
    })
    .eq('user_id', user.id)
    .select('virtual_coins, last_daily_bonus_at')
    .single();

  if (updateError || !updatedWallet) {
    console.error('[daily-bonus] Update failed:', updateError);
    return Response.json({ error: 'Falha ao atualizar saldo' }, { status: 500 });
  }

  // Insert transaction record (non-blocking, log error if fails)
  const { error: txError } = await supabase.from('transactions').insert({
    user_id: user.id,
    type: 'daily_bonus',
    amount: bonusAmount,
    balance_before: wallet.virtual_coins,
    balance_after: updatedWallet.virtual_coins,
    description: 'Bônus diário de login',
  });

  if (txError) {
    console.error('[daily-bonus] Transaction log failed:', txError);
  }

  // Return the actual persisted balance from the DB, not the calculated one
  return Response.json({
    success: true,
    bonus: bonusAmount,
    new_balance: updatedWallet.virtual_coins,
    last_daily_bonus_at: updatedWallet.last_daily_bonus_at,
  });
}
