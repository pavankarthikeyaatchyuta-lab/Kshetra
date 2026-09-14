import type { FC } from 'react';
import { Sprout, Calendar, Clock } from 'lucide-react';

interface HealthSummaryCardProps {
  score?: number;
  statusText?: string;
  lastScanned?: string;
  nextScan?: string;
  eventSeverity?: number;
}

export const HealthSummaryCard: FC<HealthSummaryCardProps> = ({
  score = 86,
  statusText = 'Good',
  lastScanned = '2 days ago',
  nextScan = 'In 5 days',
  eventSeverity,
}) => {
  // SVG circular gauge geometry
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const isLow = score < 40;
  const isMed = score >= 40 && score < 70;
  const strokeColor = isLow ? '#D32F2F' : isMed ? '#FFB300' : '#2E7D32';
  const iconBg = isLow ? 'bg-[#FFEBEE] text-[#C62828]' : isMed ? 'bg-[#FFF8E1] text-[#E65100]' : 'bg-[#E8F5E9] text-[#2E7D32]';

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4">
        {/* Left Health Status */}
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-2xl ${iconBg} shrink-0 mt-0.5`}>
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#6D4C41] uppercase tracking-wider">
              Current Field Health
            </div>
            <div className={`text-xl font-extrabold mt-0.5 ${isLow ? 'text-[#C62828]' : 'text-[#0C2518]'}`}>
              {statusText}
            </div>
            <div className="text-[10px] text-[#8D6E63] mt-0.5">
              {eventSeverity !== undefined ? (
                <span>Latest event severity: <strong className={isLow ? 'text-[#C62828]' : 'text-[#2E7D32]'}>{eventSeverity}%</strong></span>
              ) : (
                <span>Based on latest observation</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Circular Gauge */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#EAE4D5"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={strokeColor}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className={`absolute text-sm font-extrabold font-mono ${isLow ? 'text-[#C62828]' : 'text-[#0C2518]'}`}>
            {score}%
          </span>
        </div>
      </div>

      {/* Bottom Metadata Pills */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-[#F0ECE1] text-xs">
        <div className="flex items-center gap-2 text-[#2D1E16]">
          <Calendar className="w-4 h-4 text-[#8D6E63] shrink-0" />
          <div>
            <div className="text-[10px] text-[#6D4C41] uppercase leading-none">Last Scanned</div>
            <div className="font-semibold text-xs mt-0.5">{lastScanned}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#2D1E16]">
          <Clock className="w-4 h-4 text-[#8D6E63] shrink-0" />
          <div>
            <div className="text-[10px] text-[#6D4C41] uppercase leading-none">Next Recommended Scan</div>
            <div className="font-semibold text-xs mt-0.5">{nextScan}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
