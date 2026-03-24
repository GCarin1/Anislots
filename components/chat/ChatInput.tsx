'use client';

import { useState } from 'react';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/lib/utils/constants';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, CHAT_MESSAGE_MAX_LENGTH))}
        placeholder="Digite uma mensagem..."
        disabled={disabled}
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--waifu-primary)] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-30"
        style={{ background: 'var(--waifu-primary)' }}
      >
        Enviar
      </button>
    </form>
  );
}
