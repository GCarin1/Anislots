'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CryptoDepositModalProps {
  open: boolean;
  onClose: () => void;
}

export function CryptoDepositModal({ open, onClose }: CryptoDepositModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass mx-4 w-full max-w-md rounded-3xl p-8 text-center"
          >
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
            >
              Depósito Crypto
            </h2>
            <p className="mt-4" style={{ color: 'var(--app-text-muted)' }}>
              Os depósitos via criptomoeda estarão disponíveis em breve na Fase 2 do projeto.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl border border-white/10 bg-white/5 px-6 py-2 font-medium transition-colors hover:bg-white/10"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
