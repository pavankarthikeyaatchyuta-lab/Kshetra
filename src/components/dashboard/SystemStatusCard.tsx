import type { FC } from 'react';
import { Camera, MapPin, Activity, HardDrive, Cloud, Sprout } from 'lucide-react';

interface SystemStatusCardProps {
  locationStatus: 'ready' | 'not_set';
  isOnline: boolean;
}

export const SystemStatusCard: FC<SystemStatusCardProps> = ({
  locationStatus,
  isOnline,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
        <h3 className="text-xs font-bold text-[#0C2518]">
          System Status
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D32]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
          <span>All systems ready</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Hardware Status List */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6D4C41]">
              <Camera className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Camera</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-[11px] text-[#2E7D32]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              Ready
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6D4C41]">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Location</span>
            </div>
            <span className={`flex items-center gap-1 font-bold text-[11px] ${
              locationStatus === 'ready' ? 'text-[#2E7D32]' : 'text-[#E65100]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                locationStatus === 'ready' ? 'bg-[#2E7D32]' : 'bg-[#E65100]'
              }`} />
              {locationStatus === 'ready' ? 'Captured' : 'Not set'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6D4C41]">
              <Activity className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Motion Sensors</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-[11px] text-[#2E7D32]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              Available
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6D4C41]">
              <HardDrive className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Local Storage</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-[11px] text-[#2E7D32]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              Ready
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6D4C41]">
              <Cloud className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Cloud Sync</span>
            </div>
            <span className={`flex items-center gap-1 font-bold text-[11px] ${
              isOnline ? 'text-[#2E7D32]' : 'text-[#E65100]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? 'bg-[#2E7D32]' : 'bg-[#E65100]'
              }`} />
              {isOnline ? 'Synced' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Offline Working Highlight Box */}
        <div className="h-full p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex flex-col justify-center items-center text-center space-y-1.5">
          <div className="w-9 h-9 rounded-full bg-white text-[#2E7D32] flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-[#0C2518]">
            Working offline too.
          </div>
          <p className="text-[11px] text-[#2E7D32] leading-tight">
            Your data stays securely on your device.
          </p>
        </div>
      </div>
    </div>
  );
};
