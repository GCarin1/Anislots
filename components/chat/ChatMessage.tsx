'use client';

import type { ChatMessage as ChatMessageType } from '@/types/database';
import { formatRelativeTime } from '@/lib/utils/format';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  if (message.is_system) {
    return (
      <div className="px-3 py-1 text-center text-xs" style={{ color: '#fbbf24' }}>
        {message.message}
      </div>
    );
  }

  return (
    <div className="flex gap-2 px-3 py-1.5">
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
        {message.avatar_url ? (
          <img src={message.avatar_url} alt="" className="h-6 w-6 rounded-full" />
        ) : (
          message.username.charAt(0).toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold" style={{ color: 'var(--waifu-primary)' }}>
            {message.username}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
            {formatRelativeTime(message.created_at)}
          </span>
        </div>
        <p className="break-words text-sm">{message.message}</p>
      </div>
    </div>
  );
}
