import { create } from 'zustand';
import { Chat, Message, Page, UserProfile, AISettings } from '@/types';

const CHAT_URL = 'https://functions.poehali.dev/aa25c82b-2727-4e9c-8d34-9cb5b1602fbc';

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function createChat(firstMessage?: string): Chat {
  return {
    id: generateId(),
    title: firstMessage ? firstMessage.slice(0, 40) : 'Новый чат',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

interface AppState {
  currentPage: Page;
  currentChatId: string | null;
  chats: Chat[];
  profile: UserProfile;
  settings: AISettings;
  sidebarOpen: boolean;
  darkMode: boolean;
  isLoading: boolean;

  setPage: (page: Page) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<AISettings>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'chat',
  currentChatId: null,
  chats: [],
  sidebarOpen: true,
  darkMode: false,
  isLoading: false,
  profile: {
    name: 'Пользователь',
    email: 'user@example.com',
  },
  settings: {
    style: 'friendly',
    language: 'ru',
    memory: true,
    temperature: 0.7,
  },

  setPage: (page) => set({ currentPage: page }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleDarkMode: () =>
    set((s) => {
      const next = !s.darkMode;
      document.documentElement.classList.toggle('dark', next);
      return { darkMode: next };
    }),

  createNewChat: () => {
    const chat = createChat();
    set((state) => ({
      chats: [chat, ...state.chats],
      currentChatId: chat.id,
      currentPage: 'chat',
    }));
  },

  selectChat: (id) => set({ currentChatId: id, currentPage: 'chat' }),

  deleteChat: (id) =>
    set((state) => {
      const remaining = state.chats.filter((c) => c.id !== id);
      return {
        chats: remaining,
        currentChatId:
          state.currentChatId === id
            ? remaining[0]?.id ?? null
            : state.currentChatId,
      };
    }),

  sendMessage: async (content) => {
    const state = get();
    let chatId = state.currentChatId;

    if (!chatId) {
      const chat = createChat(content);
      set((s) => ({ chats: [chat, ...s.chats], currentChatId: chat.id }));
      chatId = chat.id;
    }

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    set((s) => ({
      isLoading: true,
      chats: s.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              title: c.messages.length === 0 ? content.slice(0, 40) : c.title,
              messages: [...c.messages, userMsg],
              updatedAt: new Date(),
            }
          : c
      ),
    }));

    const currentState = get();
    const chat = currentState.chats.find((c) => c.id === chatId);
    const { settings } = currentState;

    const historyMessages = settings.memory
      ? (chat?.messages ?? []).map((m) => ({ role: m.role, content: m.content }))
      : [{ role: 'user' as const, content }];

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyMessages,
          style: settings.style,
          temperature: settings.temperature,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply || data.error || 'Что-то пошло не так. Попробуйте ещё раз.',
        timestamp: new Date(),
      };

      set((s) => ({
        isLoading: false,
        chats: s.chats.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date() }
            : c
        ),
      }));
    } catch {
      const errMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.',
        timestamp: new Date(),
      };
      set((s) => ({
        isLoading: false,
        chats: s.chats.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, errMsg], updatedAt: new Date() }
            : c
        ),
      }));
    }
  },

  updateProfile: (profile) =>
    set((s) => ({ profile: { ...s.profile, ...profile } })),

  updateSettings: (settings) =>
    set((s) => ({ settings: { ...s.settings, ...settings } })),
}));