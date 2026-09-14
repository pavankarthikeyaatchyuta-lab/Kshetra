import type { FC } from 'react';
import { 
  Home, 
  Camera, 
  FileText, 
  ShieldAlert, 
  Grid, 
  BarChart3, 
  Building2, 
  Settings, 
  HelpCircle
} from 'lucide-react';
import { KshetraLogo } from '../ui/KshetraLogo';
import type { TabKey } from './BottomNav';

interface SidebarProps {
  activeTab: TabKey | 'fields' | 'insights';
  onSelectTab: (tab: TabKey | 'fields' | 'insights') => void;
  viewMode: 'field' | 'office';
  onToggleViewMode: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  viewMode,
  onToggleViewMode,
}) => {
  const mainNav = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'scan', label: 'Scan Field', icon: Camera },
    { key: 'passport', label: 'Field Passport', icon: FileText },
    { key: 'evidence', label: 'Evidence Mode', icon: ShieldAlert },
    { key: 'fields', label: 'Fields', icon: Grid },
    { key: 'insights', label: 'Insights', icon: BarChart3 },
    { key: 'office', label: 'Kshetra Office', icon: Building2, isOfficeToggle: true },
  ];

  return (
    <aside className="w-64 bg-[#08180E] text-[#FBF9F4] flex flex-col justify-between p-4 border-r border-[#163824] select-none shrink-0 min-h-screen">
      {/* Top Logo Section */}
      <div className="space-y-6">
        <div className="pt-2 pl-2">
          <KshetraLogo size="md" showTagline={true} theme="dark" />
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.isOfficeToggle 
              ? viewMode === 'office' 
              : activeTab === item.key && viewMode === 'field';

            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.isOfficeToggle) {
                    onToggleViewMode();
                  } else {
                    if (viewMode === 'office') onToggleViewMode();
                    onSelectTab(item.key as TabKey);
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#18422A] text-white shadow-sm ring-1 ring-[#81C784]/30'
                    : 'text-[#D7E3DA]/80 hover:bg-[#122E1F] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#81C784]' : 'text-[#D7E3DA]/70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings & Artistic Flourish */}
      <div className="space-y-5 pt-6 border-t border-[#163824]">
        <div className="space-y-1">
          <button
            onClick={() => {
              if (viewMode === 'office') onToggleViewMode();
              onSelectTab('more');
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'more'
                ? 'bg-[#18422A] text-white'
                : 'text-[#D7E3DA]/70 hover:bg-[#122E1F] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              if (viewMode === 'office') onToggleViewMode();
              onSelectTab('more');
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#D7E3DA]/70 hover:bg-[#122E1F] hover:text-white transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>

        {/* Decorative Leaf Graphic & Handwritten Tagline */}
        <div className="relative pt-3 pl-2 flex items-center gap-3 overflow-hidden">
          <div className="relative w-8 h-8 shrink-0">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <path
                d="M 6 34 C 12 18, 30 10, 36 6 C 34 24, 22 34, 6 34 Z"
                fill="#2E7D32"
                opacity="0.85"
              />
              <path
                d="M 6 34 Q 22 22 36 6"
                stroke="#81C784"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-serif italic text-[#C8E6C9] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Same Fields.
            </div>
            <div className="text-[13px] font-serif italic text-[#81C784] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Brighter Futures.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
