import type { FC } from 'react';
import { Search, Globe, ChevronDown } from 'lucide-react';
import type { Language } from '../../models/types';

interface TopBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopBar: FC<TopBarProps> = ({
  language,
  onLanguageChange,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  searchQuery,
  onSearchChange,
}) => {
  const effectiveOnline = isOnline && !isSimulatedOffline;

  return (
    <header className="bg-[#FBF9F4] border-b border-[#EAE4D5] px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Global Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search fields, records, or insights..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#DED5C0] text-xs text-[#2D1E16] placeholder-[#8D6E63]/70 focus:outline-hidden focus:ring-1 focus:ring-[#2E7D32] shadow-2xs"
        />
      </div>

      {/* Right Controls & Header Artistic Motto */}
      <div className="flex items-center gap-5 shrink-0">
        {/* Connection Status Pill */}
        <button
          onClick={onToggleSimulatedOffline}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            effectiveOnline
              ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
              : 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]'
          }`}
          title="Toggle online/offline simulation"
        >
          <span className={`w-2 h-2 rounded-full ${effectiveOnline ? 'bg-[#2E7D32] animate-pulse' : 'bg-[#E65100]'}`} />
          <span>{effectiveOnline ? 'Online' : 'Offline'}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {/* Language Dropdown */}
        <div className="relative flex items-center">
          <Globe className="w-4 h-4 text-[#6D4C41] absolute left-2.5 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="pl-8 pr-7 py-1.5 bg-white border border-[#DED5C0] rounded-xl text-xs font-medium text-[#2D1E16] appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#2E7D32] cursor-pointer shadow-2xs"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="te">తెలుగు</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#6D4C41] absolute right-2 pointer-events-none opacity-60" />
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#DED5C0]">
          <div className="w-8 h-8 rounded-full bg-[#1A3828] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            YK
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-[10px] text-[#8D6E63] leading-none">Hello,</div>
            <div className="text-xs font-bold text-[#0C2518] leading-tight">User</div>
          </div>
        </div>

        {/* Handwritten Elegant Motto on Far Right */}
        <div className="hidden xl:block pl-3 border-l border-[#DED5C0] text-right">
          <div className="text-sm font-serif italic text-[#2D4536] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Real Fields. Real Stories.
          </div>
          <div className="text-xs font-serif italic text-[#2E7D32] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            A Fairer Tomorrow.
          </div>
        </div>
      </div>
    </header>
  );
};
