import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('wallets')
    .select('virtual_coins, last_daily_bonus_at')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return Response.json({ error: 'Wallet not found' }, { status: 404 });
  }

  return Response.json(data);
}
