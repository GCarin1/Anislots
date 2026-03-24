'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { WaifuSelector } from '@/components/waifu/WaifuSelector';
import { useGameStore } from '@/lib/store/gameStore';
import { useWallet } from '@/hooks/useWallet';
import { JackpotCounter } from '@/components/jackpot/JackpotCounter';

export default function LobbyPage() {
  const router = useRouter();
  const selectedWaifu = useGameStore((s) => s.selectedWaifu);

  // Initialize wallet
  useWallet();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="text-center">
        <h1
          className="text-4xl font-black text-glow-waifu md:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Escolha sua Waifu
        </h1>
        <p className="mt-2" style={{ color: 'var(--app-text-muted)' }}>
          Cada waifu possui um tema visual único para sua máquina caça-níquel
        </p>
      </div>

      <JackpotCounter />

      <WaifuSelector />

      <div className="flex justify-center">
        <motion.button
          onClick={() => router.push('/slot')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-2xl px-10 py-4 text-xl font-bold text-white shadow-lg glow-waifu"
          style={{
            fontFamily: 'var(--font-display)',
            background: `linear-gradient(135deg, var(--waifu-primary), var(--waifu-secondary))`,
          }}
        >
          Jogar com {selectedWaifu.charAt(0).toUpperCase() + selectedWaifu.slice(1)}
        </motion.button>
      </div>
    </div>
  );
}
