import { useAppStore } from '@/store/useAppStore';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'chat', label: 'Диалог', icon: 'MessageSquare' },
  { id: 'history', label: 'История', icon: 'Clock' },
  { id: 'settings', label: 'Настройки', icon: 'SlidersHorizontal' },
  { id: 'about', label: 'Возможности', icon: 'Sparkles' },
  { id: 'help', label: 'Справка', icon: 'CircleHelp' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

export default function Sidebar() {
  const { currentPage, setPage, chats, currentChatId, selectChat, createNewChat, deleteChat, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:relative z-30 h-full flex flex-col
          bg-[hsl(0,0%,96%)] border-r border-border
          transition-all duration-200
          ${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden md:w-14'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
          {sidebarOpen && (
            <span className="text-sm font-medium tracking-tight">Elf</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`nav-item w-full text-left ${
                currentPage === item.id
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={16} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}

          {sidebarOpen && chats.length > 0 && (
            <>
              <div className="mt-4 mb-1 px-3">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                  Чаты
                </span>
              </div>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group sidebar-item flex items-center justify-between ${
                    currentChatId === chat.id ? 'sidebar-item-active' : ''
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <span className="truncate flex-1 text-xs">{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity shrink-0 ml-1"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="px-2 py-3 border-t border-border shrink-0">
          <button
            onClick={createNewChat}
            className={`nav-item w-full justify-center text-muted-foreground hover:text-foreground hover:bg-accent border border-dashed border-border ${
              sidebarOpen ? 'justify-start' : ''
            }`}
          >
            <Icon name="Plus" size={16} />
            {sidebarOpen && <span>Новый чат</span>}
          </button>
        </div>
      </aside>
    </>
  );
}