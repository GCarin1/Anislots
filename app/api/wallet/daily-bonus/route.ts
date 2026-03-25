import { createServerClient, createServiceClient } from '@/lib/supabase/server';
import { canClaimDailyBonus, calculateBonusResult, parseUpdateResult } from '@/lib/wallet/dailyBonus';

export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service client to bypass RLS for write operations
  const serviceClient = await createServiceClient();

  // Fetch current wallet
  const { data: wallet, error: walletError } = await serviceClient
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

  // Update wallet without .single() to avoid PGRST116 on RLS-filtered results
  const { data: updateData, error: updateError } = await serviceClient
    .from('wallets')
    .update({
      virtual_coins: newBalance,
      last_daily_bonus_at: now,
      updated_at: now,
    })
    .eq('user_id', user.id)
    .select('virtual_coins, last_daily_bonus_at');

  const parsed = parseUpdateResult(updateData, updateError);

  if (!parsed.success || !parsed.wallet) {
    console.error('[daily-bonus] Update failed:', parsed.errorMessage);
    return Response.json({ error: 'Falha ao atualizar saldo' }, { status: 500 });
  }

  // Insert transaction record
  const { error: txError } = await serviceClient.from('transactions').insert({
    user_id: user.id,
    type: 'daily_bonus',
    amount: bonusAmount,
    balance_before: wallet.virtual_coins,
    balance_after: parsed.wallet.virtual_coins,
    description: 'Bônus diário de login',
  });

  if (txError) {
    console.error('[daily-bonus] Transaction log failed:', txError);
  }

  // Return the actual persisted balance from the DB
  return Response.json({
    success: true,
    bonus: bonusAmount,
    new_balance: parsed.wallet.virtual_coins,
    last_daily_bonus_at: parsed.wallet.last_daily_bonus_at,
  });
}
