import { createServerClient, createServiceClient } from '@/lib/supabase/server';
import {
  canClaimDailyBonus,
  calculateBonusResult,
  buildBonusUpdatePayload,
  parseUpdateResult,
} from '@/lib/wallet/dailyBonus';

export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const serviceClient = await createServiceClient();

  // Fetch current wallet
  const { data: wallet, error: walletError } = await serviceClient
    .from('wallets')
    .select('virtual_coins, last_daily_bonus_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (walletError) {
    console.error('[daily-bonus] Wallet fetch error:', walletError);
    return Response.json({ error: 'Wallet not found' }, { status: 404 });
  }

  // Current balance (0 if wallet doesn't exist yet)
  const currentBalance = wallet?.virtual_coins ?? 0;
  const lastBonusAt = wallet?.last_daily_bonus_at ?? null;

  // Validate cooldown
  const check = canClaimDailyBonus(lastBonusAt, Date.now());
  if (!check.canClaim) {
    return Response.json(
      { error: 'Bônus já coletado hoje', next_bonus_at: check.nextBonusAt },
      { status: 429 },
    );
  }

  const { newBalance, bonusAmount } = calculateBonusResult(currentBalance);
  const now = new Date().toISOString();
  const payload = buildBonusUpdatePayload(newBalance, now);

  let finalBalance = newBalance;
  let finalBonusAt = now;

  if (wallet) {
    // Wallet exists - try update
    const { data: updateData, error: updateError } = await serviceClient
      .from('wallets')
      .update(payload)
      .eq('user_id', user.id)
      .select('virtual_coins, last_daily_bonus_at');

    const parsed = parseUpdateResult(updateData, updateError);

    if (!parsed.success || !parsed.wallet) {
      // Fallback: try upsert if update affected 0 rows
      console.warn('[daily-bonus] Update returned 0 rows, trying upsert fallback');
      const { data: upsertData, error: upsertError } = await serviceClient
        .from('wallets')
        .upsert(
          { user_id: user.id, ...payload },
          { onConflict: 'user_id' },
        )
        .select('virtual_coins, last_daily_bonus_at');

      const upsertParsed = parseUpdateResult(upsertData, upsertError);

      if (!upsertParsed.success || !upsertParsed.wallet) {
        console.error('[daily-bonus] Upsert also failed:', upsertParsed.errorMessage);
        return Response.json({ error: 'Falha ao atualizar saldo' }, { status: 500 });
      }

      finalBalance = upsertParsed.wallet.virtual_coins;
      finalBonusAt = upsertParsed.wallet.last_daily_bonus_at ?? now;
    } else {
      finalBalance = parsed.wallet.virtual_coins;
      finalBonusAt = parsed.wallet.last_daily_bonus_at ?? now;
    }
  } else {
    // No wallet exists - create one via upsert
    const { data: upsertData, error: upsertError } = await serviceClient
      .from('wallets')
      .upsert(
        { user_id: user.id, ...payload },
        { onConflict: 'user_id' },
      )
      .select('virtual_coins, last_daily_bonus_at');

    const upsertParsed = parseUpdateResult(upsertData, upsertError);

    if (!upsertParsed.success || !upsertParsed.wallet) {
      console.error('[daily-bonus] Wallet creation failed:', upsertParsed.errorMessage);
      return Response.json({ error: 'Falha ao criar carteira' }, { status: 500 });
    }

    finalBalance = upsertParsed.wallet.virtual_coins;
    finalBonusAt = upsertParsed.wallet.last_daily_bonus_at ?? now;
  }

  // Log transaction
  const { error: txError } = await serviceClient.from('transactions').insert({
    user_id: user.id,
    type: 'daily_bonus',
    amount: bonusAmount,
    balance_before: currentBalance,
    balance_after: finalBalance,
    description: 'Bônus diário de login',
  });

  if (txError) {
    console.error('[daily-bonus] Transaction log failed:', txError);
  }

  return Response.json({
    success: true,
    bonus: bonusAmount,
    new_balance: finalBalance,
    last_daily_bonus_at: finalBonusAt,
  });
}
