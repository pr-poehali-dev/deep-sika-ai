import Icon from '@/components/ui/icon';

const capabilities = [
  {
    icon: 'BrainCircuit',
    title: 'Контекстная память',
    desc: 'ИИ помнит всё сказанное в рамках диалога и учитывает контекст при каждом ответе.',
  },
  {
    icon: 'FileText',
    title: 'Работа с текстом',
    desc: 'Редактирование, рерайт, суммаризация, перевод и генерация текстов любых форматов.',
  },
  {
    icon: 'BarChart2',
    title: 'Анализ данных',
    desc: 'Разбор таблиц, структурирование информации, выявление закономерностей.',
  },
  {
    icon: 'Lightbulb',
    title: 'Генерация идей',
    desc: 'Мозговой штурм, поиск решений, нестандартные подходы к задачам.',
  },
  {
    icon: 'Code2',
    title: 'Помощь с кодом',
    desc: 'Написание, отладка и объяснение кода на большинстве популярных языков.',
  },
  {
    icon: 'MessageCircle',
    title: 'Диалоговый формат',
    desc: 'Уточняющие вопросы, итеративное улучшение ответов, адаптация под вас.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground mb-4">
            <Icon name="Sparkles" size={20} className="text-background" />
          </div>
          <h2 className="text-2xl font-light tracking-tight mb-2">Возможности</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Интеллектуальный ассистент нового поколения с поддержкой длинного контекста
            и гибкими настройками стиля общения.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {capabilities.map((cap, i) => (
            <div
              key={cap.title}
              className="p-5 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all duration-150 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Icon name={cap.icon} size={16} className="text-foreground" />
              </div>
              <h3 className="text-sm font-medium mb-1">{cap.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium mb-3">Технические характеристики</h3>
          <div className="flex flex-col gap-2">
            {[
              ['Контекстное окно', '128 000 токенов'],
              ['Языки', 'Русский, Английский'],
              ['Режим работы', 'Диалоговый'],
              ['Память сессии', 'Активна в рамках чата'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{k}</span>
                <span className="text-xs font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
