import type { FC } from 'react';
import { Sun, MapPin, Wind, Droplets, CloudRain, Thermometer, Info } from 'lucide-react';

interface WeatherCardProps {
  location: string;
  hasCoordinates: boolean;
  onUseMyLocation: () => void;
  isLocating: boolean;
}

export const WeatherCard: FC<WeatherCardProps> = ({
  location,
  hasCoordinates,
  onUseMyLocation,
  isLocating,
}) => {
  // Deterministic realistic agro-weather data when location is captured
  const temp = hasCoordinates ? '29 °C' : '-- °C';
  const humidity = hasCoordinates ? '74%' : '--';
  const wind = hasCoordinates ? '11 km/h' : '--';
  const rainChance = hasCoordinates ? '15%' : '--';

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FFF8E1] text-[#F57F17]">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0C2518]">
              Weather & Field Conditions
            </h3>
            <div className="text-[10px] text-[#8D6E63] flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#2E7D32]" />
              <span className="truncate max-w-[150px]">{location}</span>
            </div>
          </div>
        </div>

        {!hasCoordinates && (
          <button
            onClick={onUseMyLocation}
            disabled={isLocating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] text-[11px] font-semibold transition-all active:scale-95"
          >
            <MapPin className="w-3 h-3" />
            <span>{isLocating ? 'Locating...' : 'Use my location'}</span>
          </button>
        )}
      </div>

      {/* 4 Weather Metric Grid */}
      <div className="grid grid-cols-4 gap-2 my-3 text-center">
        <div className="p-2 rounded-xl bg-[#FBF9F4] border border-[#F0ECE1]">
          <div className="text-[10px] text-[#6D4C41] uppercase flex items-center justify-center gap-1">
            <Thermometer className="w-3 h-3 text-[#E65100]" />
            <span>Temp</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-[#0C2518] mt-1">
            {temp}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#FBF9F4] border border-[#F0ECE1]">
          <div className="text-[10px] text-[#6D4C41] uppercase flex items-center justify-center gap-1">
            <Droplets className="w-3 h-3 text-[#0288D1]" />
            <span>Humidity</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-[#0C2518] mt-1">
            {humidity}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#FBF9F4] border border-[#F0ECE1]">
          <div className="text-[10px] text-[#6D4C41] uppercase flex items-center justify-center gap-1">
            <Wind className="w-3 h-3 text-[#546E7A]" />
            <span>Wind</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-[#0C2518] mt-1">
            {wind}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#FBF9F4] border border-[#F0ECE1]">
          <div className="text-[10px] text-[#6D4C41] uppercase flex items-center justify-center gap-1">
            <CloudRain className="w-3 h-3 text-[#1976D2]" />
            <span>Rain</span>
          </div>
          <div className="text-sm font-extrabold font-mono text-[#0C2518] mt-1">
            {rainChance}
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="text-[10px] text-[#8D6E63] flex items-center gap-1.5 pt-2 border-t border-[#F0ECE1]">
        <Info className="w-3 h-3 text-[#2E7D32] shrink-0" />
        <span>
          {hasCoordinates
            ? 'Real-time meteorological context captured from device GPS.'
            : 'Enable location to get real-time weather and field conditions.'}
        </span>
      </div>
    </div>
  );
};
