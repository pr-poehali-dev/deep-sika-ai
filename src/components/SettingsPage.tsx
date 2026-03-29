import { useAppStore } from '@/store/useAppStore';
import Icon from '@/components/ui/icon';

const styleOptions = [
  { value: 'friendly', label: 'Дружелюбный', desc: 'Тёплый и неформальный тон' },
  { value: 'formal', label: 'Деловой', desc: 'Чёткий и профессиональный' },
  { value: 'concise', label: 'Лаконичный', desc: 'Коротко и по делу' },
] as const;

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-lg mx-auto animate-fade-in">
        <h2 className="text-base font-medium mb-6">Настройки поведения ИИ</h2>

        <div className="flex flex-col gap-4">
          <Section title="Стиль общения">
            <div className="flex flex-col gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ style: opt.value })}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 text-left ${
                    settings.style === opt.value
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border bg-card hover:border-foreground/20'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>
                  {settings.style === opt.value && (
                    <Icon name="Check" size={16} className="shrink-0 ml-3" />
                  )}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Память и контекст">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div>
                <p className="text-sm font-medium">Сохранять контекст сессии</p>
                <p className="text-xs text-muted-foreground mt-0.5">ИИ помнит ход беседы в рамках диалога</p>
              </div>
              <button
                onClick={() => updateSettings({ memory: !settings.memory })}
                className={`w-10 h-6 rounded-full transition-colors duration-200 shrink-0 relative ${
                  settings.memory ? 'bg-foreground' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    settings.memory ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </Section>

          <Section title="Температура (креативность)">
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Точнее</p>
                <span className="text-sm font-mono font-medium">{settings.temperature.toFixed(1)}</span>
                <p className="text-sm text-muted-foreground">Креативнее</p>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.temperature}
                onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-foreground"
              />
            </div>
          </Section>

          <Section title="Язык ответов">
            <div className="flex gap-2">
              {(['ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateSettings({ language: lang })}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    settings.language === lang
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card hover:border-foreground/20'
                  }`}
                >
                  {lang === 'ru' ? 'Русский' : 'English'}
                </button>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium mb-2 px-1">{title}</p>
      {children}
    </div>
  );
}
