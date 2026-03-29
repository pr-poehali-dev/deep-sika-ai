import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Icon from '@/components/ui/icon';

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(date);
}

export default function ChatPage() {
  const { chats, currentChatId, sendMessage, createNewChat } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'user') {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    if (!currentChatId) createNewChat();
    setInput('');
    sendMessage(text);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  if (!currentChatId || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="mb-10 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground mb-5">
              <Icon name="Sparkles" size={20} className="text-background" />
            </div>
            <h1 className="text-2xl font-light tracking-tight mb-2">Чем могу помочь?</h1>
            <p className="text-sm text-muted-foreground">Начните диалог — я запомню контекст беседы</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-8">
            {[
              'Объясни простыми словами',
              'Помоги с текстом',
              'Проанализируй данные',
              'Придумай идеи',
            ].map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                className="text-left px-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-accent transition-all duration-150"
              >
                {s}
              </button>
            ))}
          </div>

          <ChatInput
            input={input}
            textareaRef={textareaRef}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onSend={handleSend}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="shrink-0 w-7 h-7 rounded-full bg-foreground flex items-center justify-center mt-0.5">
                  <Icon name="Sparkles" size={12} className="text-background" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-foreground text-background rounded-tr-sm'
                    : 'bg-card border border-border text-foreground rounded-tl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span className={`text-[11px] mt-1.5 block ${msg.role === 'user' ? 'text-background/50 text-right' : 'text-muted-foreground'}`}>
                  {formatTime(new Date(msg.timestamp))}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="shrink-0 w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                <Icon name="Sparkles" size={12} className="text-background" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="px-4 py-4 border-t border-border bg-background">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            input={input}
            textareaRef={textareaRef}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}

function ChatInput({
  input, textareaRef, onChange, onKeyDown, onSend
}: {
  input: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex items-end gap-2 border border-border rounded-2xl bg-card px-3 py-2 focus-within:border-foreground/30 transition-colors">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Напишите сообщение..."
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 py-1.5 min-h-[36px] max-h-40"
      />
      <button
        onClick={onSend}
        disabled={!input.trim()}
        className="shrink-0 w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-30 hover:bg-foreground/80 transition-all duration-150 mb-0.5"
      >
        <Icon name="ArrowUp" size={15} />
      </button>
    </div>
  );
}
