'use client';

import { useRouter } from 'next/navigation';
import { ProfileInfo } from '@/components/profile/ProfileInfo';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg transition-colors hover:bg-white/10"
          aria-label="Voltar"
        >
          ←
        </button>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
        >
          Meu Perfil
        </h1>
      </div>
      <ProfileInfo />
    </div>
  );
}
