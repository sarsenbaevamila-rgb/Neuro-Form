import React from 'react';

const StrategyDashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      <header className="mb-6 md:mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">Проект: NEURO.FORM</h2>
        <p className="text-slate-400 text-sm md:text-base">Стратегия цифрового продукта с высоким потенциалом (2025)</p>
      </header>

      {/* 1. Market Analysis Summary */}
      <section className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded w-fit">ГОЛУБОЙ ОКЕАН</span>
          <h3 className="text-lg md:text-xl font-semibold text-slate-200">Ниша "Нейро-Цифровая Аскеза"</h3>
        </div>
        <p className="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">
          Пока рынок переполнен курсами "Как использовать ChatGPT", существует вакуум в нише 
          <strong> "Гуманистическая адаптация ИИ"</strong>. Растет спрос на <em>сохранение когнитивных функций</em> при интеграции нейросетей.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded-lg">
            <h4 className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Проблема</h4>
            <p className="text-slate-200 text-sm md:text-base">Цифровое выгорание и "ИИ-тревожность" (страх замены).</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg">
            <h4 className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Решение</h4>
            <p className="text-emerald-400 text-sm md:text-base">Нейро-цифровой экзоскелет и дополненная креативность.</p>
          </div>
        </div>
      </section>

      {/* 2. The Big Idea */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 p-4 md:p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg md:text-xl font-semibold text-slate-200 mb-4">Большая Идея: Цифровой Экзоскелет</h3>
          <p className="text-slate-300 mb-6 text-sm md:text-base">
            Закрытое сообщество + когортный курс, сфокусированный на восстановлении биологического потенциала мозга через дофаминовые протоколы, одновременно с освоением продвинутых ИИ-воркфлоу.
          </p>
          <ul className="space-y-3 text-sm md:text-base">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span className="text-slate-300"><strong>Аватар:</strong> Сеньор-фрилансеры, владельцы агентств (30-45 лет).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span className="text-slate-300"><strong>Обещание:</strong> "Сделай 4 часа глубокой работы за 45 минут".</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span className="text-slate-300"><strong>Формат:</strong> 30-дневный спринт + "Хранилище" (библиотека промптов).</span>
            </li>
          </ul>
        </div>

        {/* 3. Visual Identity */}
        <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Визуальная ДНК</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 uppercase">Стиль</span>
                <p className="text-slate-200">Соларпанк x Баухаус</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase">Палитра</span>
                <div className="flex gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#064e3b]" title="Лесной зеленый"></div>
                  <div className="w-8 h-8 rounded-full bg-[#cbd5e1]" title="Хром"></div>
                  <div className="w-8 h-8 rounded-full bg-[#d4d4d8]" title="Бетон"></div>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded hover:bg-emerald-600/30 transition-colors text-sm">
            Смотреть ассеты бренда
          </button>
        </div>
      </div>

      {/* 4. Launch Plan */}
      <section>
        <h3 className="text-lg md:text-xl font-semibold text-slate-200 mb-6">План запуска (30 дней)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { day: "Неделя 1", title: "Фундамент", desc: "Генерация бренд-ассетов и копирайтинга для лендинга." },
            { day: "Неделя 2", title: "Посев", desc: "Запуск контент-воронки (Shorts/Reels/Посты)." },
            { day: "Неделя 3", title: "Сообщество", desc: "Открытие бета-доступа к 'Neuro.Form' (Лимит)." },
            { day: "Неделя 4", title: "Масштаб", desc: "Вебинар: 'Биологический мозг против ИИ'." }
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
              <div className="text-emerald-500 font-mono text-xs mb-2">{item.day}</div>
              <h4 className="font-medium text-slate-200 mb-1 text-sm md:text-base">{item.title}</h4>
              <p className="text-slate-400 text-xs md:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StrategyDashboard;