import { useState } from 'react';
import type { FC } from 'react';
import type { Field, Observation, Language } from '../models/types';
import { translations } from '../services/i18n';
import { requestRealLocation } from '../services/hardware';
import { 
  Camera, 
  ShieldCheck, 
  MapPin, 
  Sprout, 
  Layers, 
  History, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HomeScreenProps {
  field: Field;
  observations: Observation[];
  onUpdateField: (field: Field) => void;
  onNavigate: (tab: 'home' | 'scan' | 'passport' | 'evidence' | 'more') => void;
  language: Language;
}

export const HomeScreen: FC<HomeScreenProps> = ({
  field,
  observations,
  onUpdateField,
  onNavigate,
  language,
}) => {
  const t = translations[language];
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Time-based dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  const handleUseMyLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const res = await requestRealLocation();
      if (res.status === 'success') {
        onUpdateField({
          ...field,
          location: res.displayText,
          coordinates: res.coordinates,
          isDemo: false,
        });
      } else {
        setLocationError(res.displayText);
      }
    } catch {
      setLocationError('Unable to access device location');
    } finally {
      setIsLocating(false);
    }
  };

  const handleUseDemoField = () => {
    onUpdateField({
      ...field,
      location: 'Demo field',
      coordinates: undefined,
      isDemo: true,
    });
    setLocationError(null);
  };

  return (
    <div className="space-y-4 pb-20 pt-1 max-w-md mx-auto px-4">
      {/* Greeting Header */}
      <div className="pt-2">
        <span className="text-xs font-semibold tracking-wider text-[#2E7D32] uppercase">
          {getGreeting()}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#0C2518] mt-0.5">
          {t.intelligenceAtGlance}
        </h1>
      </div>

      {/* Differentiator Banner: EVIDENCE CONTINUITY */}
      <div className="rounded-2xl p-3.5 bg-linear-to-r from-[#0C2518] to-[#18442D] text-[#FBF9F4] shadow-md border border-[#2E7D32]/30 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#2E7D32]/40 text-[#81C784] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold tracking-widest uppercase text-[#81C784]">
                {t.evidenceContinuity}
              </h3>
            </div>
            <p className="text-xs text-[#D7E3DA] mt-1 leading-relaxed">
              {t.evidenceContinuityDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Active Field Card */}
      <div className="rounded-2xl bg-white border border-[#EAE4D5] p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest text-[#6D4C41] uppercase">
              {t.activeField}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#0C2518] text-[#81C784] font-mono text-xs font-bold">
              {field.id}
            </span>
          </div>
          {field.isDemo ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
              {t.demoBadge}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              LIVE FIELD
            </span>
          )}
        </div>

        {/* Field Details Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2 text-[#2D1E16]">
            <Sprout className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <div>
              <div className="text-[10px] text-[#6D4C41] uppercase">{t.crop}</div>
              <div className="font-semibold text-sm">{field.crop}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#2D1E16]">
            <Layers className="w-4 h-4 text-[#8D6E63] shrink-0" />
            <div>
              <div className="text-[10px] text-[#6D4C41] uppercase">{t.area}</div>
              <div className="font-semibold text-sm">{field.area}</div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-3 pt-3 border-t border-[#F0ECE1]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 flex-1">
              <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-[#6D4C41] uppercase font-semibold">
                  {t.location}:
                </span>{' '}
                <span className="text-xs font-medium text-[#1A221D] break-all">
                  {field.location === 'Location not set' ? t.locationNotSet : field.location}
                </span>
              </div>
            </div>
          </div>

          {/* Location Action Buttons */}
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-98"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isLocating ? 'Capturing GPS...' : t.useMyLocation}</span>
            </button>

            {field.location !== 'Demo field' && (
              <button
                onClick={handleUseDemoField}
                className="py-1.5 px-2.5 rounded-lg bg-[#F5F2EA] hover:bg-[#EAE4D5] text-[#6D4C41] text-xs font-medium transition-colors"
              >
                {t.useDemoField}
              </button>
            )}
          </div>

          {locationError && (
            <p className="mt-1.5 text-[11px] text-[#C62828] font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {locationError}
            </p>
          )}
        </div>

        {/* Field Status */}
        <div className="mt-3 pt-2.5 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
          <span className="text-[#6D4C41]">{t.status}:</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            {t.monitoring}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => onNavigate('scan')}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#0C2518] hover:bg-[#123824] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-98"
        >
          <Camera className="w-5 h-5 text-[#81C784]" />
          <span>{t.scanFieldCTA}</span>
        </button>

        <button
          onClick={() => onNavigate('passport')}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F2EA] text-[#123824] border border-[#DED5C0] font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.openPassportCTA}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#6D4C41] ml-auto" />
        </button>
      </div>

      {/* Field Story Preview Timeline */}
      <div className="rounded-2xl bg-white border border-[#EAE4D5] p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#2E7D32]" />
            <h2 className="text-sm font-bold text-[#0C2518]">
              {t.fieldStoryPreview}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('passport')}
            className="text-[11px] font-semibold text-[#2E7D32] hover:underline"
          >
            View All ({observations.length})
          </button>
        </div>

        <div className="space-y-3 pt-3">
          {observations.slice(0, 3).map((obs) => (
            <div
              key={obs.id}
              onClick={() => onNavigate('passport')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F4] border border-[#F0ECE1] hover:bg-[#F5F2EA] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={obs.photoUrl}
                  alt={obs.condition}
                  className="w-10 h-10 rounded-lg object-cover border border-[#DED5C0]"
                />
                <div>
                  <div className="font-semibold text-xs text-[#0C2518] line-clamp-1">
                    {obs.condition}
                  </div>
                  <div className="text-[10px] text-[#6D4C41] flex items-center gap-1.5 mt-0.5">
                    <span>{new Date(obs.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    {obs.isDemo && (
                      <span className="px-1 rounded bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold">
                        {t.demoBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold font-mono text-[#2E7D32]">
                  {obs.confidence}%
                </div>
                <div className="text-[9px] text-[#8D6E63] uppercase">
                  {t.confidenceLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Integrity Proof Card */}
      <div className="rounded-xl p-3 bg-[#F5F2EA] border border-[#EAE4D5] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
          <span className="font-medium text-[#2D1E16]">Cryptographic Hash Continuity</span>
        </div>
        <button
          onClick={() => onNavigate('evidence')}
          className="text-[11px] font-bold text-[#2E7D32] hover:underline"
        >
          Verify Proof →
        </button>
      </div>
    </div>
  );
};
