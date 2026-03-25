import { describe, it, expect } from 'vitest';
import { formatProfileData } from './profile';

describe('formatProfileData', () => {
  const baseProfile = {
    id: 'user-123',
    username: 'TestUser',
    avatar_url: null,
    selected_waifu: 'sakura',
    created_at: '2025-06-15T10:30:00Z',
    updated_at: '2025-06-20T14:00:00Z',
  };

  const baseWallet = {
    virtual_coins: 15000,
    total_deposited: 5000,
    total_withdrawn: 0,
  };

  it('deve retornar dados formatados do perfil', () => {
    const result = formatProfileData(baseProfile, 'test@email.com', baseWallet);

    expect(result.username).toBe('TestUser');
    expect(result.email).toBe('test@email.com');
    expect(result.balance).toBe(15000);
    expect(result.totalDeposited).toBe(5000);
    expect(result.totalWithdrawn).toBe(0);
    expect(result.selectedWaifu).toBe('sakura');
    expect(result.avatarUrl).toBeNull();
  });

  it('deve formatar a data de criação da conta', () => {
    const result = formatProfileData(baseProfile, 'test@email.com', baseWallet);

    expect(result.memberSince).toBeDefined();
    expect(typeof result.memberSince).toBe('string');
    expect(result.memberSince.length).toBeGreaterThan(0);
  });

  it('deve usar "Jogador" como fallback quando username está vazio', () => {
    const profile = { ...baseProfile, username: '' };
    const result = formatProfileData(profile, 'test@email.com', baseWallet);

    expect(result.username).toBe('Jogador');
  });

  it('deve lidar com wallet nulo retornando zeros', () => {
    const result = formatProfileData(baseProfile, 'test@email.com', null);

    expect(result.balance).toBe(0);
    expect(result.totalDeposited).toBe(0);
    expect(result.totalWithdrawn).toBe(0);
  });

  it('deve mascarar o email parcialmente', () => {
    const result = formatProfileData(baseProfile, 'longname@email.com', baseWallet);

    expect(result.maskedEmail).toBe('lon*****@email.com');
  });

  it('deve mascarar emails curtos corretamente', () => {
    const result = formatProfileData(baseProfile, 'ab@x.com', baseWallet);

    expect(result.maskedEmail).toBe('a*@x.com');
  });
});
