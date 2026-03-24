import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { CHAT_HISTORY_LIMIT } from '@/lib/utils/constants';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();

  const room = req.nextUrl.searchParams.get('room') ?? 'global';

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room', room)
    .order('created_at', { ascending: false })
    .limit(CHAT_HISTORY_LIMIT);

  if (error) {
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }

  return Response.json(data?.reverse() ?? []);
}
