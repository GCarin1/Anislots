import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('jackpot')
    .select('current_amount, last_winner_username, last_won_at, last_won_amount')
    .eq('id', 1)
    .single();

  if (error) {
    return Response.json({ error: 'Failed to fetch jackpot' }, { status: 500 });
  }

  return Response.json(data);
}
