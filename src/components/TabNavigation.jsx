import { Home, List, Utensils, Bot, User } from 'lucide-react';

const icons = {
  Home: Home,
  Exercises: List,
  Nutrition: Utensils,
  'AI Coach': Bot,
  Profile: User,
};

export default function TabNavigation({ tabs, activeTab, onChange }) {
  return (
    <nav className="sticky bottom-0 z-10 bg-white border-t">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {tabs.map((t) => {
          const Icon = icons[t.key] || Home;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              aria-label={`Go to ${t.label}`}
              onClick={() => onChange(t.key)}
              className={`flex flex-col items-center justify-center gap-1 py-2 text-xs ${
                active ? 'text-teal-700' : 'text-neutral-600'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-teal-700' : 'text-neutral-500'}`} />
              <span className="font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
