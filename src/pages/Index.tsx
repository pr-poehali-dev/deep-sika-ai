import { useAppStore } from '@/store/useAppStore';
import Sidebar from '@/components/Sidebar';
import ChatPage from '@/components/ChatPage';
import HistoryPage from '@/components/HistoryPage';
import ProfilePage from '@/components/ProfilePage';
import SettingsPage from '@/components/SettingsPage';
import AboutPage from '@/components/AboutPage';
import HelpPage from '@/components/HelpPage';
import Icon from '@/components/ui/icon';

export default function Index() {
  const { currentPage, sidebarOpen, setSidebarOpen } = useAppStore();

  const pageTitles: Record<string, string> = {
    chat: 'Диалог',
    history: 'История диалогов',
    profile: 'Профиль',
    settings: 'Настройки',
    about: 'Возможности',
    help: 'Справка',
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-background shrink-0">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="Menu" size={18} />
            </button>
          )}
          <span className="text-sm font-medium">{pageTitles[currentPage]}</span>
        </header>

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {currentPage === 'chat' && <ChatPage />}
          {currentPage === 'history' && <HistoryPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'help' && <HelpPage />}
        </main>
      </div>
    </div>
  );
}
