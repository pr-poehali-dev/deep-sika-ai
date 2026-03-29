import { useAppStore } from '@/store/useAppStore';
import Icon from '@/components/ui/icon';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export default function HistoryPage() {
  const { chats, selectChat, deleteChat } = useAppStore();

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon name="Clock" size={18} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium mb-1">История пуста</p>
        <p className="text-sm text-muted-foreground">Начните диалог — он появится здесь</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-base font-medium mb-5">История диалогов</h2>
        <div className="flex flex-col gap-2">
          {chats.map((chat, i) => (
            <div
              key={chat.id}
              className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all duration-150 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => selectChat(chat.id)}
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Icon name="MessageSquare" size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{chat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {chat.messages.length} сообщ. · {formatDate(chat.updatedAt)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all shrink-0"
              >
                <Icon name="Trash2" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
