import type { FC } from 'react';
import { KshetraLogo } from '../ui/KshetraLogo';
import type { Language } from '../../models/types';
import { translations } from '../../services/i18n';
import { Wifi, WifiOff, Globe, Building2, Smartphone } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  viewMode: 'field' | 'office';
  onToggleViewMode: () => void;
}

export const Header: FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  viewMode,
  onToggleViewMode,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F4]/95 backdrop-blur-md border-b border-[#EAE4D5] px-4 py-2.5 flex items-center justify-between transition-all">
      {/* Brand logo & Demo indicator */}
      <div className="flex items-center gap-2">
        <KshetraLogo size="sm" theme="light" />
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
          DEMO ONLY
        </span>
      </div>

      {/* Action icons & controls */}
      <div className="flex items-center gap-2">
        {/* Offline / Online Status Badge */}
        <button
          onClick={onToggleSimulatedOffline}
          title={isOnline && !isSimulatedOffline ? 'Online - Click to test offline mode' : 'Offline - Stored on device'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all shadow-xs ${
            isOnline && !isSimulatedOffline
              ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
              : 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]'
          }`}
        >
          {isOnline && !isSimulatedOffline ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              <Wifi className="w-3 h-3" />
              <span className="hidden xs:inline">ONLINE</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E65100]" />
              <WifiOff className="w-3 h-3" />
              <span>OFFLINE</span>
            </>
          )}
        </button>

        {/* Stakeholder Office View Switcher */}
        <button
          onClick={onToggleViewMode}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
            viewMode === 'office'
              ? 'bg-[#0C2518] text-[#FBF9F4] border-[#0C2518]'
              : 'bg-white text-[#123824] border-[#DED5C0] hover:bg-[#F5F2EA]'
          }`}
          title={viewMode === 'office' ? 'Switch to Field App' : 'Switch to Kshetra Office (Stakeholder view)'}
        >
          {viewMode === 'office' ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#81C784]" />
              <span className="hidden sm:inline">Field App</span>
            </>
          ) : (
            <>
              <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span className="hidden sm:inline">{t.office}</span>
            </>
          )}
        </button>

        {/* Language selector */}
        <div className="relative flex items-center">
          <Globe className="w-3.5 h-3.5 text-[#6D4C41] absolute left-2 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="pl-6.5 pr-2 py-1 bg-white border border-[#DED5C0] rounded-lg text-xs font-medium text-[#2D1E16] focus:outline-hidden focus:ring-1 focus:ring-[#2E7D32] cursor-pointer shadow-2xs"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
      </div>
    </header>
  );
};
