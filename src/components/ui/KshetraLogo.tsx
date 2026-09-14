import type { FC } from 'react';

interface KshetraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  theme?: 'dark' | 'light';
  animated?: boolean;
  className?: string;
}

export const KshetraLogo: FC<KshetraLogoProps> = ({
  size = 'md',
  showTagline = false,
  theme = 'light',
  animated = false,
  className = '',
}) => {
  const isDark = theme === 'dark';

  // Sizing configurations
  const dimensions = {
    sm: { height: 26, kWidth: 26, fontSize: 'text-lg', tagSize: 'text-[9px]' },
    md: { height: 36, kWidth: 36, fontSize: 'text-2xl', tagSize: 'text-xs' },
    lg: { height: 52, kWidth: 52, fontSize: 'text-4xl', tagSize: 'text-sm' },
    hero: { height: 72, kWidth: 72, fontSize: 'text-5xl sm:text-6xl', tagSize: 'text-sm sm:text-base' },
  };

  const currentDim = dimensions[size];
  const stemFill = isDark ? '#F5F2EA' : '#0C2518';

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Main Logo Row: Leaf-K emblem + SHETRA wordmark */}
      <div className="flex items-center gap-1">
        {/* The Exact "Leaf-K" Emblem */}
        <div className={`shrink-0 ${animated ? 'animate-subtle-pulse' : ''}`} style={{ width: currentDim.kWidth, height: currentDim.height }}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Leaf Gradient: Vibrant natural green to deeper forest green */}
              <linearGradient id="leafGradTop" x1="20%" y1="90%" x2="90%" y2="10%">
                <stop offset="0%" stop-color="#2E7D32" />
                <stop offset="50%" stop-color="#43A047" />
                <stop offset="100%" stop-color="#76FF03" />
              </linearGradient>
              <linearGradient id="leafGradBottom" x1="15%" y1="15%" x2="85%" y2="85%">
                <stop offset="0%" stop-color="#1B5E20" />
                <stop offset="45%" stop-color="#388E3C" />
                <stop offset="100%" stop-color="#66BB6A" />
              </linearGradient>
              <filter id="leafShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* 1. Left Vertical Stem of the K */}
            <rect
              x="10"
              y="10"
              width="18"
              height="80"
              rx="3.5"
              fill={stemFill}
            />

            {/* 2. Upper Diagonal Arm = Botanical Leaf pointing Up-Right */}
            <g filter="url(#leafShadow)">
              {/* Leaf Body */}
              <path
                d="M 28 48 C 30 32, 45 16, 88 12 C 84 32, 68 52, 34 53 Z"
                fill="url(#leafGradTop)"
              />
              {/* Central Vein */}
              <path
                d="M 30 50 Q 52 32 88 12"
                stroke="#C8E6C9"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Lateral Veins */}
              <path d="M 45 38 Q 48 30 55 27" stroke="#A5D6A7" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M 57 29 Q 62 21 70 19" stroke="#A5D6A7" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M 69 21 Q 74 15 80 14" stroke="#A5D6A7" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M 48 41 Q 54 44 60 41" stroke="#388E3C" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 61 32 Q 67 36 74 32" stroke="#388E3C" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>

            {/* 3. Lower Diagonal Arm = Botanical Leaf pointing Down-Right */}
            <g filter="url(#leafShadow)">
              {/* Leaf Body */}
              <path
                d="M 32 46 C 44 48, 62 60, 78 88 C 55 88, 38 78, 28 54 Z"
                fill="url(#leafGradBottom)"
              />
              {/* Central Vein */}
              <path
                d="M 31 48 Q 50 66 78 88"
                stroke="#A5D6A7"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Lateral Veins */}
              <path d="M 42 58 Q 44 67 48 72" stroke="#81C784" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M 52 68 Q 56 77 62 81" stroke="#81C784" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M 46 54 Q 54 55 60 59" stroke="#1B5E20" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 57 63 Q 66 65 72 70" stroke="#1B5E20" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>
          </svg>
        </div>

        {/* The Wordmark: SHETRA */}
        <span
          className={`${currentDim.fontSize} font-black tracking-wider uppercase font-sans ${
            isDark ? 'text-[#F5F2EA]' : 'text-[#0C2518]'
          }`}
          style={{ letterSpacing: '0.04em', lineHeight: 1 }}
        >
          SHETRA
        </span>
      </div>

      {/* The Exact Tagline: "The Field That Remembers" */}
      {showTagline && (
        <div className={`mt-1 font-sans font-medium tracking-tight ${currentDim.tagSize}`}>
          <span className={isDark ? 'text-[#EDE8DC]' : 'text-[#2D1E16]'}>
            The Field That{' '}
          </span>
          <span className="text-[#4CAF50] font-bold">
            Remembers
          </span>
        </div>
      )}
    </div>
  );
};
