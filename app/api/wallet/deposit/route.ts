import { createServerClient } from '@/lib/supabase/server';

export async function POST() {
  // Placeholder for crypto deposit integration (Phase 2)
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json(
    { error: 'Deposits via crypto will be available soon' },
    { status: 501 },
  );
}
