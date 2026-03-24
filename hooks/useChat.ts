'use client';

import { useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useChatStore } from '@/lib/store/chatStore';
import type { ChatMessage } from '@/types/database';
import { CHAT_HISTORY_LIMIT } from '@/lib/utils/constants';

export function useChat(room: string = 'global') {
  const { messages, addMessage, setMessages } = useChatStore();

  useEffect(() => {
    const supabase = createBrowserClient();

    supabase
      .from('chat_messages')
      .select('*')
      .eq('room', room)
      .order('created_at', { ascending: false })
      .limit(CHAT_HISTORY_LIMIT)
      .then(({ data }) => {
        if (data) setMessages(data.reverse() as ChatMessage[]);
      });

    const channel = supabase
      .channel(`chat-${room}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room=eq.${room}`,
        },
        (payload) => {
          addMessage(payload.new as ChatMessage);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, addMessage, setMessages]);

  const sendMessage = useCallback(
    async (message: string, userId: string, username: string, avatarUrl?: string) => {
      const supabase = createBrowserClient();
      await supabase.from('chat_messages').insert({
        user_id: userId,
        username,
        avatar_url: avatarUrl,
        message,
        room,
      });
    },
    [room],
  );

  return { messages, sendMessage };
}
