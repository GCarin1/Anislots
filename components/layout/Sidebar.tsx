'use client';

import { useChatStore } from '@/lib/store/chatStore';
import { LiveChat } from '@/components/chat/LiveChat';

export function Sidebar() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed right-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-80 border-l border-white/10 transition-transform md:block ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--app-surface)' }}
      >
        <LiveChat />
      </aside>

      {/* Toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg glow-waifu md:bottom-4"
        style={{ background: 'var(--waifu-primary)' }}
      >
        💬
      </button>
    </>
  );
}
