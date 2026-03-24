import { create } from 'zustand';
import type { ChatMessage } from '@/types/database';

interface ChatStore {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  isOpen: boolean;
  toggleChat: () => void;
  setIsOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages.slice(-99), message],
    })),
  isOpen: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (open) => set({ isOpen: open }),
}));
