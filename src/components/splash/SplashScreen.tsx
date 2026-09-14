import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { KshetraLogo } from '../ui/KshetraLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: FC<SplashScreenProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);
  const [statusText, setStatusText] = useState('Initializing device sensors...');

  useEffect(() => {
    // Sequence status messages smoothly
    const t1 = setTimeout(() => {
      setStatusText('Preparing field intelligence...');
    }, 600);

    // Start fading out at 1.25s
    const t2 = setTimeout(() => {
      setFading(true);
    }, 1300);

    // Complete transition to main app at 1.6s
    const t3 = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      onClick={() => onComplete()} // Allow instant tap-to-enter
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#0C2518] text-[#FBF9F4] transition-all duration-300 ease-out cursor-pointer select-none ${
        fading ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 40%, #153A26 0%, #0C2518 70%, #06150D 100%)',
      }}
    >
      {/* Top Demo Disclaimer */}
      <div className="pt-6 flex flex-col items-center gap-1.5">
        <div className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>FOR DEMO PURPOSES ONLY</span>
        </div>
        <div className="text-[10px] font-mono tracking-widest text-[#81C784]/60 uppercase">
          Offline-First Field Intelligence · Evaluation Prototype
        </div>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center my-auto transform -translate-y-4">
        {/* Subtle breathing animation container */}
        <div className="p-4 rounded-3xl bg-[#091C12]/50 border border-[#2E7D32]/30 shadow-2xl backdrop-blur-sm">
          <KshetraLogo size="hero" showTagline={true} theme="dark" animated={true} />
        </div>

        {/* Dynamic agricultural furrow animation lines */}
        <div className="w-56 h-1 mt-6 relative overflow-hidden rounded-full bg-[#183827]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#81C784] to-transparent w-28 animate-[scan-line_1.8s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Bottom status & prompt */}
      <div className="pb-8 flex flex-col items-center gap-2 text-center max-w-sm">
        <div className="px-3 py-1 rounded-lg bg-black/40 border border-amber-500/30 text-amber-200/90 text-[11px] font-mono">
          Interactive Demo — Synthetic Crop Diagnostics & Telemetry
        </div>
        <p className="text-xs text-[#A5D6A7] font-medium tracking-wide">
          {statusText}
        </p>
        <span className="text-[10px] text-[#81C784]/40 tracking-wider">
          Tap anywhere to continue
        </span>
      </div>
    </div>
  );
};
