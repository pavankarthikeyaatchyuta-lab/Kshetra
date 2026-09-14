import type { FC, ComponentType } from 'react';
import { Home, Camera, ShieldCheck, ShieldAlert, MoreHorizontal } from 'lucide-react';
import type { Language } from '../../models/types';
import { translations } from '../../services/i18n';

export type TabKey = 'home' | 'scan' | 'passport' | 'evidence' | 'more' | 'fields' | 'insights';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  language: Language;
}

export const BottomNav: FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  language,
}) => {
  const t = translations[language];

  const navItems: { key: TabKey; label: string; icon: ComponentType<{ className?: string }>; isHero?: boolean }[] = [
    { key: 'home', label: t.home, icon: Home },
    { key: 'scan', label: t.scan, icon: Camera, isHero: true },
    { key: 'passport', label: t.passport, icon: ShieldCheck },
    { key: 'evidence', label: t.evidence, icon: ShieldAlert },
    { key: 'more', label: t.more, icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F4]/98 backdrop-blur-md border-t border-[#EAE4D5] safe-area-pb pb-1 transition-all">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          if (item.isHero) {
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className="relative -top-3 flex flex-col items-center group focus:outline-hidden"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#2E7D32] text-white ring-4 ring-[#81C784]/40'
                      : 'bg-[#0C2518] text-white hover:bg-[#123824]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-[#123824] mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-150 active:scale-95 focus:outline-hidden ${
                isActive ? 'text-[#123824] font-bold' : 'text-[#6D4C41] hover:text-[#2D1E16]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110 text-[#2E7D32]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#2E7D32]" />
                )}
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
