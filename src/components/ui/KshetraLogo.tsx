import type { FC } from 'react';

interface KshetraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  theme?: 'dark' | 'light';
  animated?: boolean;
}

export const KshetraLogo: FC<KshetraLogoProps> = ({
  size = 'md',
  showTagline = false,
  theme = 'light',
  animated = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    hero: 'w-24 h-24',
  };

  const titleSizes = {
    sm: 'text-base tracking-widest font-bold',
    md: 'text-xl tracking-widest font-bold',
    lg: 'text-3xl tracking-widest font-extrabold',
    hero: 'text-4xl tracking-widest font-black',
  };

  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center select-none text-center">
      <div className="flex items-center gap-3">
        {/* Brand Emblem */}
        <div className={`relative flex items-center justify-center shrink-0 ${animated ? 'animate-subtle-pulse' : ''}`}>
          <svg
            className={`${iconSizes[size]} transition-transform duration-300`}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background pill */}
            <rect width="64" height="64" rx="16" fill={isDark ? '#08170F' : '#0C2518'} />
            
            {/* Field Furrows / Contours */}
            <path
              d="M12 48 C 24 42, 40 42, 52 48"
              stroke="#2E7D32"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M16 54 C 26 49, 38 49, 48 54"
              stroke="#8D6E63"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Sacred Field / Leaf Silhouette */}
            <path
              d="M32 9 C 32 9, 49 18, 49 33 C 49 45, 34 51, 32 51 C 30 51, 15 45, 15 33 C 15 18, 32 9, 32 9 Z"
              fill={isDark ? '#0E2E1D' : '#143823'}
              stroke="#4CAF50"
              strokeWidth="2"
            />

            {/* Central Continuity Spine (Evidence Line) */}
            <path
              d="M32 14 L 32 47"
              stroke="#81C784"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M32 23 C 38 21, 42 23, 44 26"
              stroke="#81C784"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M32 30 C 26 28, 22 30, 20 33"
              stroke="#81C784"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M32 38 C 38 36, 42 38, 43 41"
              stroke="#81C784"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Seed of Truth / Integrity Apex */}
            <circle cx="32" cy="14" r="2.8" fill="#FBF9F4" />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="text-left">
          <span
            className={`${titleSizes[size]} ${
              isDark ? 'text-[#FBF9F4]' : 'text-[#0C2518]'
            } uppercase font-serif`}
            style={{ letterSpacing: '0.18em' }}
          >
            Kshetra
          </span>
          {size !== 'sm' && (
            <div className={`text-[10px] tracking-wider uppercase font-medium ${
              isDark ? 'text-[#81C784]' : 'text-[#2E7D32]'
            }`}>
              Field Intelligence
            </div>
          )}
        </div>
      </div>

      {showTagline && (
        <p
          className={`mt-2 text-xs md:text-sm font-semibold tracking-widest uppercase ${
            isDark ? 'text-[#D7E3DA]' : 'text-[#2D4536]'
          }`}
          style={{ letterSpacing: '0.24em' }}
        >
          The Field That Remembers
        </p>
      )}
    </div>
  );
};
