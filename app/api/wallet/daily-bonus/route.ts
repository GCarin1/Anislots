import { createServerClient } from '@/lib/supabase/server';
import { DAILY_BONUS_AMOUNT } from '@/lib/utils/constants';

const HOURS_24 = 24 * 60 * 60 * 1000;

export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: wallet } = await supabase
    .from('wallets')
    .select('virtual_coins, last_daily_bonus_at')
    .eq('user_id', user.id)
    .single();

  if (!wallet) {
    return Response.json({ error: 'Wallet not found' }, { status: 404 });
  }

  const lastBonus = wallet.last_daily_bonus_at
    ? new Date(wallet.last_daily_bonus_at).getTime()
    : 0;
  const now = Date.now();

  if (now - lastBonus < HOURS_24) {
    const nextBonus = new Date(lastBonus + HOURS_24);
    return Response.json(
      { error: 'Bônus já coletado hoje', next_bonus_at: nextBonus.toISOString() },
      { status: 429 },
    );
  }

  const newBalance = wallet.virtual_coins + DAILY_BONUS_AMOUNT;

  await supabase
    .from('wallets')
    .update({
      virtual_coins: newBalance,
      last_daily_bonus_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  await supabase.from('transactions').insert({
    user_id: user.id,
    type: 'daily_bonus',
    amount: DAILY_BONUS_AMOUNT,
    balance_before: wallet.virtual_coins,
    balance_after: newBalance,
    description: 'Bônus diário de login',
  });

  return Response.json({ success: true, bonus: DAILY_BONUS_AMOUNT, new_balance: newBalance });
}
