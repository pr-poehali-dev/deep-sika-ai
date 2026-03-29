import { useState } from 'react';
import Icon from '@/components/ui/icon';

const faqs = [
  {
    q: 'Как начать новый диалог?',
    a: 'Нажмите кнопку «Новый чат» в нижней части боковой панели или просто напишите сообщение на стартовом экране.',
  },
  {
    q: 'Сохраняются ли мои переписки?',
    a: 'Да, все диалоги сохраняются в разделе «История». Вы можете вернуться к любому чату и продолжить беседу.',
  },
  {
    q: 'Что такое контекстная память?',
    a: 'В рамках одного диалога ИИ помнит всё, о чём вы говорили. При старте нового чата контекст обнуляется.',
  },
  {
    q: 'Как изменить стиль общения?',
    a: 'Перейдите в раздел «Настройки» и выберите нужный стиль: дружелюбный, деловой или лаконичный.',
  },
  {
    q: 'Как удалить диалог?',
    a: 'Наведите курсор на нужный чат в боковой панели или в разделе «История» — появится кнопка удаления.',
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-xl mx-auto animate-fade-in">
        <h2 className="text-base font-medium mb-2">Справка</h2>
        <p className="text-sm text-muted-foreground mb-6">Ответы на частые вопросы</p>

        <div className="flex flex-col gap-2 mb-8">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl border border-dashed border-border bg-card/50">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="LifeBuoy" size={18} className="text-muted-foreground" />
            <h3 className="text-sm font-medium">Нужна помощь?</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Если не нашли ответ — напишите нам, и мы поможем разобраться.
          </p>
          <button className="text-xs text-foreground border border-border rounded-lg px-3 py-2 hover:bg-accent transition-colors">
            Написать в поддержку
          </button>
        </div>
      </div>
    </div>
  );
}
