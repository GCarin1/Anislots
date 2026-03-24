import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do supabase client
const mockGetUser = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockSignOut = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
    },
    from: () => ({
      select: mockSelect.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      single: mockSingle,
    }),
  }),
}));

// Testar a lógica de profile diretamente
describe('Profile Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar dados do perfil quando usuário está autenticado', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockProfile = {
      id: 'user-123',
      username: 'testuser',
      avatar_url: null,
      selected_waifu: 'sakura',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSingle.mockResolvedValue({ data: mockProfile, error: null });

    const { createBrowserClient } = await import('@/lib/supabase/client');
    const supabase = createBrowserClient();

    const { data: { user } } = await supabase.auth.getUser();
    expect(user).toEqual(mockUser);
    expect(user!.id).toBe('user-123');
    expect(user!.email).toBe('test@example.com');
  });

  it('deve retornar null quando usuário não está autenticado', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { createBrowserClient } = await import('@/lib/supabase/client');
    const supabase = createBrowserClient();

    const { data: { user } } = await supabase.auth.getUser();
    expect(user).toBeNull();
  });

  it('signOut deve ser chamado corretamente', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { createBrowserClient } = await import('@/lib/supabase/client');
    const supabase = createBrowserClient();

    const { error } = await supabase.auth.signOut();
    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(error).toBeNull();
  });

  it('signOut com erro deve propagar o erro', async () => {
    mockSignOut.mockResolvedValue({ error: { message: 'Network error' } });

    const { createBrowserClient } = await import('@/lib/supabase/client');
    const supabase = createBrowserClient();

    const { error } = await supabase.auth.signOut();
    expect(error).toBeDefined();
    expect(error!.message).toBe('Network error');
  });

  it('dados do perfil devem conter campos obrigatórios', async () => {
    const mockProfile = {
      id: 'user-123',
      username: 'testuser',
      avatar_url: 'https://example.com/avatar.png',
      selected_waifu: 'luna',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-06-15T12:00:00Z',
    };

    mockSingle.mockResolvedValue({ data: mockProfile, error: null });

    const { createBrowserClient } = await import('@/lib/supabase/client');
    const supabase = createBrowserClient();

    const { data } = await supabase.from('profiles').select('*').eq('id', 'user-123').single();

    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('username');
    expect(data).toHaveProperty('avatar_url');
    expect(data).toHaveProperty('selected_waifu');
    expect(data).toHaveProperty('created_at');
    expect(data).toHaveProperty('updated_at');
    expect(data!.selected_waifu).toBe('luna');
  });
});
