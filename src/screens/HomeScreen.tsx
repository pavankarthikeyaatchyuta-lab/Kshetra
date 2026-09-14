import type { FC } from 'react';
import { useState } from 'react';
import type { Field, Observation } from '../models/types';
import { requestRealLocation } from '../services/hardware';
import { 
  Sprout, 
  MapPin, 
  Layers, 
  ArrowRight, 
  Trash2, 
  MoreVertical, 
  Info 
} from 'lucide-react';

import { QuickActions } from '../components/dashboard/QuickActions';
import { HealthSummaryCard } from '../components/dashboard/HealthSummaryCard';
import { WeatherCard } from '../components/weather/WeatherCard';
import { CadastralMap } from '../components/map/CadastralMap';
import { RecentScansCard } from '../components/dashboard/RecentScansCard';
import { SystemStatusCard } from '../components/dashboard/SystemStatusCard';

interface HomeScreenProps {
  field: Field;
  observations: Observation[];
  onUpdateField: (field: Field) => void;
  onNavigate: (tab: 'home' | 'scan' | 'passport' | 'evidence' | 'more' | 'fields' | 'insights') => void;
  isOnline: boolean;
  onDeleteObservation?: (id: string) => void;
  onRecordAction?: () => void;
  onSelectObservation?: (obsId: string) => void;
}

export const HomeScreen: FC<HomeScreenProps> = ({
  field,
  observations,
  onUpdateField,
  onNavigate,
  isOnline,
  onDeleteObservation,
  onRecordAction,
  onSelectObservation,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [activeMenuObsId, setActiveMenuObsId] = useState<string | null>(null);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! ☀️';
    if (hour < 17) return 'Good afternoon! 🌤️';
    return 'Good evening! 🌙';
  };

  const handleUseMyLocation = async () => {
    setIsLocating(true);
    try {
      const res = await requestRealLocation();
      if (res.status === 'success') {
        onUpdateField({
          ...field,
          location: res.displayText,
          coordinates: res.coordinates,
          isDemo: false,
        });
      }
    } catch {
      // ignore
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 pt-2 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* 1. Header Greeting & Demo Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C2518]">
            {getGreeting()}
          </h1>
          <p className="text-xs sm:text-sm text-[#6D4C41] font-medium mt-0.5">
            Field intelligence at a glance.
          </p>
        </div>

        {/* Prominent Dashboard Demo Notice Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF8F00] animate-pulse" />
          <span className="text-xs font-mono font-black text-[#E65100] uppercase tracking-wider">
            FOR DEMO PURPOSES ONLY
          </span>
        </div>
      </div>

      {/* Dashboard Demo Purpose Notice Box */}
      <div className="rounded-2xl p-3.5 bg-linear-to-r from-[#FFF8E1] via-[#FFF3E0] to-[#FFF8E1] border border-[#FFE082] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-[#E65100] text-white font-mono font-black text-[10px] tracking-wider uppercase shrink-0 shadow-2xs">
            DEMO ENVIRONMENT
          </span>
          <p className="text-xs text-[#5D4037] font-medium">
            This dashboard displays simulated parcel telemetry, sensor feeds, and AI disease detections strictly for demonstration purposes.
          </p>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] font-bold text-[#E65100] bg-white px-2.5 py-1 rounded-full border border-[#FFE082] shrink-0">
          PROTOTYPE v2.4
        </span>
      </div>

      {/* 2. Top Hero Grid: Active Field Banner + 4 Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Active Field Cinematic Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#DED5C0] shadow-sm relative flex flex-col justify-between min-h-[280px] bg-[#0C2518] text-[#FBF9F4] group">
          {/* Background Cinematic Banner */}
          <div className="absolute inset-0 z-0">
            <img
              src="/paddy-banner.svg"
              alt="Paddy Field Sunset"
              className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-700"
            />
            {/* Dark gradient overlay on left for sharp legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
            {/* Ambient sunlight dust animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-[#FFF59D] animate-float-dust opacity-40" style={{ animationDelay: '0.2s', animationDuration: '4.5s' }} />
              <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-[#C8E6C9] animate-float-dust opacity-30" style={{ animationDelay: '1.2s', animationDuration: '6s' }} />
              <div className="absolute top-3/4 left-1/2 w-1 h-1 rounded-full bg-[#FFF59D] animate-float-dust opacity-50" style={{ animationDelay: '2.4s', animationDuration: '5s' }} />
            </div>
          </div>

          {/* Top Info Row */}
          <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#A5D6A7] uppercase">
                Active Field
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                  {field.id}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
                  FOR DEMO PURPOSES ONLY
                </span>
              </div>

              {/* Field Attributes */}
              <div className="space-y-1 mt-3 text-xs text-[#EAE4D5]">
                <div className="flex items-center gap-2">
                  <Sprout className="w-3.5 h-3.5 text-[#81C784]" />
                  <span className="font-semibold text-white">{field.crop}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#81C784]" />
                  <span>{field.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#81C784]" />
                  <span>{field.location}</span>
                  <Info className="w-3 h-3 text-[#A5D6A7]/70" />
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" />
                  <span className="font-medium text-[#76FF03]">{field.status}</span>
                </div>
              </div>
            </div>

            {/* View on Map Button (Scrolls smoothly to Cadastral Map) */}
            <button
              onClick={() => {
                const el = document.getElementById('cadastral-map-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate('fields');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[#81C784]" />
              <span>View on Map</span>
            </button>
          </div>

          {/* Bottom Dual Action Buttons */}
          <div className="relative z-10 p-5 sm:p-6 pt-0 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('scan')}
              className="py-2.5 px-5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs tracking-wider uppercase shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Scan Field</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('passport')}
              className="py-2.5 px-4 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-xs font-semibold text-xs transition-all active:scale-95"
            >
              Open Field Passport
            </button>
          </div>
        </div>

        {/* 4 Quick Action Cards Grid (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <QuickActions
            onScanField={() => onNavigate('scan')}
            onRecordAction={onRecordAction || (() => onNavigate('passport'))}
            onEvidenceMode={() => onNavigate('evidence')}
            onViewPassport={() => onNavigate('passport')}
          />
        </div>
      </div>

      {/* 3. Middle Metrics Row: Current Field Health + Weather & Field Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <HealthSummaryCard
          score={86}
          statusText="Good"
          lastScanned="2 days ago"
          nextScan="In 5 days"
        />

        <WeatherCard
          location={field.location}
          hasCoordinates={!!field.coordinates}
          onUseMyLocation={handleUseMyLocation}
          isLocating={isLocating}
        />
      </div>

      {/* 4. Bottom 3-Column Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column 1: Field Story Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
            <div>
              <h3 className="text-xs font-bold text-[#0C2518]">
                Field Story
              </h3>
              <p className="text-[10px] text-[#6D4C41]">
                A timeline of what your field has experienced.
              </p>
            </div>
            <button
              onClick={() => onNavigate('passport')}
              className="text-[11px] font-semibold text-[#2E7D32] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Timeline Items with Visual Photos & Status Badges */}
          <div className="relative pl-5 space-y-3.5 border-l-2 border-[#EAE4D5] ml-2">
            {observations.slice(0, 4).map((obs) => {
              const isHealthy = obs.severity <= 10;
              const isIntervention = obs.condition.toLowerCase().includes('recovery') || obs.condition.toLowerCase().includes('post');
              const isDisease = obs.severity > 25;

              return (
                <div key={obs.id} className="relative group">
                  {/* Timeline Dot */}
                  <span className={`absolute -left-[27px] top-3.5 w-3 h-3 rounded-full border-2 border-white shadow-2xs ${
                    isDisease ? 'bg-[#C62828]' : isHealthy ? 'bg-[#2E7D32]' : 'bg-[#558B2F]'
                  }`} />

                  {/* Timeline Item Content Card */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F4] border border-[#F0ECE1] hover:border-[#81C784] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={obs.photoUrl}
                        alt={obs.condition}
                        className="w-12 h-12 rounded-xl object-cover border border-[#DED5C0] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] text-[#8D6E63] font-mono leading-none">
                          {new Date(obs.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h4 className="text-xs font-bold text-[#0C2518] truncate mt-0.5">
                          {obs.condition}
                        </h4>
                        <div className="text-[10px] text-[#6D4C41] truncate mt-0.5">
                          {obs.observations && obs.observations[0] ? obs.observations[0] : 'Observation recorded'}
                        </div>
                      </div>
                    </div>

                    {/* Right Badge & Three-Dot Menu */}
                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      {isHealthy && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                          Health {obs.confidence}%
                        </span>
                      )}
                      {isDisease && !isHealthy && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEBEE] text-[#C62828]">
                          Severity {obs.severity}%
                        </span>
                      )}
                      {isIntervention && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F8E9] text-[#558B2F]">
                          Action
                        </span>
                      )}

                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuObsId(activeMenuObsId === obs.id ? null : obs.id)}
                          className="p-1 text-[#8D6E63] hover:text-[#0C2518] rounded"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {activeMenuObsId === obs.id && (
                          <div className="absolute right-0 top-6 z-20 bg-white rounded-xl shadow-lg border border-[#DED5C0] p-1 w-28">
                            <button
                              onClick={() => {
                                onDeleteObservation?.(obs.id);
                                setActiveMenuObsId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-xs text-[#C62828] hover:bg-[#FFEBEE] rounded-lg font-medium flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Field Location (Cadastral Satellite Map) (4 cols) */}
        <div id="cadastral-map-section" className="lg:col-span-4 scroll-mt-20">
          <CadastralMap
            field={field}
            onUseMyLocation={handleUseMyLocation}
            isLocating={isLocating}
          />
        </div>

        {/* Column 3: Recent Scans + System Status (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          <RecentScansCard
            observations={observations}
            onViewAll={() => onNavigate('passport')}
            onSelectObservation={(obs) => {
              if (onSelectObservation) {
                onSelectObservation(obs.id);
              } else {
                onNavigate('passport');
              }
            }}
          />

          <SystemStatusCard
            locationStatus={field.coordinates ? 'ready' : 'not_set'}
            isOnline={isOnline}
          />
        </div>
      </div>
    </div>
  );
};
