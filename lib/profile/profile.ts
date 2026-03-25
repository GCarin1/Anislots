import { formatDate } from '@/lib/utils/format';

interface ProfileInput {
  id: string;
  username: string;
  avatar_url: string | null;
  selected_waifu: string;
  created_at: string;
  updated_at: string;
}

interface WalletInput {
  virtual_coins: number;
  total_deposited: number;
  total_withdrawn: number;
}

export interface FormattedProfile {
  username: string;
  email: string;
  maskedEmail: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  selectedWaifu: string;
  avatarUrl: string | null;
  memberSince: string;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  const visible = local.slice(0, 3);
  const masked = '*'.repeat(Math.max(local.length - 3, 1));
  return `${visible}${masked}@${domain}`;
}

export function formatProfileData(
  profile: ProfileInput,
  email: string,
  wallet: WalletInput | null,
): FormattedProfile {
  return {
    username: profile.username || 'Jogador',
    email,
    maskedEmail: maskEmail(email),
    balance: wallet?.virtual_coins ?? 0,
    totalDeposited: wallet?.total_deposited ?? 0,
    totalWithdrawn: wallet?.total_withdrawn ?? 0,
    selectedWaifu: profile.selected_waifu,
    avatarUrl: profile.avatar_url,
    memberSince: formatDate(profile.created_at),
  };
}
