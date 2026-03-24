'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function LiveChat() {
  const { messages, sendMessage } = useChat('global');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend(text: string) {
    // In a real app, get user info from auth context
    sendMessage(text, 'anonymous', 'Visitante');
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-bold" style={{ color: 'var(--waifu-primary)' }}>
          Chat Global
        </h3>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="p-4 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
            Nenhuma mensagem ainda...
          </p>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
