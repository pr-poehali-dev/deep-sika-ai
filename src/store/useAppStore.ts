import { create } from 'zustand';
import { Chat, Message, Page, UserProfile, AISettings } from '@/types';

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

  setPage: (page: Page) => void;
  setSidebarOpen: (open: boolean) => void;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<AISettings>) => void;
}

const DEMO_RESPONSES = [
  'Понял вас. Это действительно интересный вопрос — давайте разберём по шагам.',
  'Отличный вопрос. Здесь важно учесть несколько ключевых аспектов.',
  'Согласен с вашим подходом. Вот что я думаю по этому поводу.',
  'Обработал ваш запрос. Вот структурированный ответ.',
  'Хороший вопрос. Позвольте предложить несколько вариантов решения.',
];

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'chat',
  currentChatId: null,
  chats: [],
  sidebarOpen: true,
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

  sendMessage: (content) => {
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

    setTimeout(() => {
      const aiMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content:
          DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)] +
          '\n\nЭто демо-режим. Для подключения реального ИИ настройте API в разделе Настройки.',
        timestamp: new Date(),
      };
      set((s) => ({
        chats: s.chats.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date() }
            : c
        ),
      }));
    }, 900);
  },

  updateProfile: (profile) =>
    set((s) => ({ profile: { ...s.profile, ...profile } })),

  updateSettings: (settings) =>
    set((s) => ({ settings: { ...s.settings, ...settings } })),
}));
