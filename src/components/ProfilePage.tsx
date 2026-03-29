import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Icon from '@/components/ui/icon';

export default function ProfilePage() {
  const { profile, updateProfile, chats } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const totalMessages = chats.reduce((acc, c) => acc + c.messages.length, 0);

  const save = () => {
    updateProfile({ name, email });
    setEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-lg mx-auto animate-fade-in">
        <h2 className="text-base font-medium mb-6">Личный кабинет</h2>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center">
            <Icon name="User" size={24} className="text-background" />
          </div>
          <div>
            <p className="font-medium">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-2xl font-light">{chats.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Диалогов</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-2xl font-light">{totalMessages}</p>
            <p className="text-xs text-muted-foreground mt-1">Сообщений</p>
          </div>
        </div>

        <div className="border border-border rounded-xl bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Данные профиля</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <Icon name="Pencil" size={12} />
                Изменить
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Имя</label>
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none focus:border-foreground/30 transition-colors"
                />
              ) : (
                <p className="text-sm">{profile.name}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Email</label>
              {editing ? (
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none focus:border-foreground/30 transition-colors"
                />
              ) : (
                <p className="text-sm">{profile.email}</p>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={save}
                className="px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:bg-foreground/80 transition-colors"
              >
                Сохранить
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
