import type { FC } from 'react';
import { Camera, ArrowRight, Sprout, FileCheck, AlertTriangle } from 'lucide-react';
import type { Observation } from '../../models/types';

interface RecentScansCardProps {
  observations: Observation[];
  onViewAll: () => void;
  onSelectObservation?: (obs: Observation) => void;
}

export const RecentScansCard: FC<RecentScansCardProps> = ({
  observations,
  onViewAll,
  onSelectObservation,
}) => {
  const recentThree = observations.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs flex flex-col justify-between space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#2E7D32]" />
          <h3 className="text-xs font-bold text-[#0C2518]">
            Recent Scans
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] font-semibold text-[#2E7D32] hover:underline flex items-center gap-0.5"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3 Photo Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {recentThree.map((obs) => {
          const isHealthy = obs.severity <= 10;
          const isIntervention = obs.condition.toLowerCase().includes('recovery') || obs.condition.toLowerCase().includes('post');
          const isDisease = obs.severity > 25;

          return (
            <div
              key={obs.id}
              onClick={() => onSelectObservation?.(obs)}
              className="group cursor-pointer rounded-xl overflow-hidden border border-[#DED5C0] hover:border-[#2E7D32] hover:shadow-sm transition-all"
            >
              {/* Photo Thumbnail */}
              <div className="aspect-4/3 w-full bg-[#1A3018] overflow-hidden relative">
                <img
                  src={obs.photoUrl}
                  alt={obs.condition}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Meta */}
              <div className="p-2 bg-white space-y-1">
                <div className="text-[9px] text-[#8D6E63] font-mono leading-none truncate">
                  {new Date(obs.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-[10px] font-bold text-[#0C2518] truncate leading-tight">
                  {obs.condition}
                </div>

                {/* Status Badge */}
                <div className="pt-0.5 flex items-center gap-1">
                  {isHealthy && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#2E7D32]">
                      <Sprout className="w-2.5 h-2.5" />
                      <span>{obs.confidence}%</span>
                    </span>
                  )}
                  {isDisease && !isHealthy && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#C62828]">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{obs.severity}%</span>
                    </span>
                  )}
                  {isIntervention && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#558B2F]">
                      <FileCheck className="w-2.5 h-2.5" />
                      <span>Action</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
