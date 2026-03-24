'use client';

import { useChatStore } from '@/lib/store/chatStore';
import { cn } from '@/lib/utils/cn';

export function GameLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useChatStore();

  return (
    <main
      className={cn(
        'min-h-[calc(100vh-4rem)] pb-16 transition-all md:pb-0',
        isOpen ? 'md:mr-80' : '',
      )}
    >
      {children}
    </main>
  );
}
