import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  username: z.string().min(2).max(30).optional(),
  selected_waifu: z.string().min(1).max(50).optional(),
  avatar_url: z.string().url().optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = UpdateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: 'Failed to update profile' }, { status: 500 });
  }

  return Response.json(data);
}
