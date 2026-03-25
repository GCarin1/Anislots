import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { validateAndPrepareBonus, parseUpdateResult } from '@/lib/wallet/dailyBonus';

export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin client bypasses RLS via @supabase/supabase-js (not @supabase/ssr)
  const admin = createAdminClient();

  // Fetch current wallet
  const { data: wallet } = await admin
    .from('wallets')
    .select('virtual_coins, last_daily_bonus_at')
    .eq('user_id', user.id)
    .maybeSingle();

  // Validate and prepare bonus
  const prepared = validateAndPrepareBonus(
    wallet?.virtual_coins ?? 0,
    wallet?.last_daily_bonus_at ?? null,
  );

  if (!prepared.canClaim) {
    return Response.json(
      { error: 'Bônus já coletado hoje', next_bonus_at: prepared.nextBonusAt },
      { status: 429 },
    );
  }

  // Apply update
  const { data: updateData, error: updateError } = await admin
    .from('wallets')
    .update(prepared.payload!)
    .eq('user_id', user.id)
    .select('virtual_coins, last_daily_bonus_at');

  const parsed = parseUpdateResult(updateData, updateError);

  if (!parsed.success || !parsed.wallet) {
    console.error('[daily-bonus] Update failed:', parsed.errorMessage);
    return Response.json({ error: 'Falha ao atualizar saldo' }, { status: 500 });
  }

  // Log transaction (non-critical)
  await admin.from('transactions').insert({
    user_id: user.id,
    type: 'daily_bonus',
    amount: prepared.bonusAmount,
    balance_before: prepared.balanceBefore,
    balance_after: parsed.wallet.virtual_coins,
    description: 'Bônus diário de login',
  });

  return Response.json({
    success: true,
    bonus: prepared.bonusAmount,
    new_balance: parsed.wallet.virtual_coins,
    last_daily_bonus_at: parsed.wallet.last_daily_bonus_at,
  });
}
