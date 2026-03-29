export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type Page = 'chat' | 'history' | 'profile' | 'help' | 'about' | 'settings';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface AISettings {
  style: 'formal' | 'friendly' | 'concise';
  language: 'ru' | 'en';
  memory: boolean;
  temperature: number;
}
