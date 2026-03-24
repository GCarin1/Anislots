import { createServerClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Jackpot claim is handled atomically inside process_spin RPC
  // This endpoint exists for future manual claim flows
  return Response.json({ error: 'Jackpot is claimed automatically during spin' }, { status: 400 });
}
