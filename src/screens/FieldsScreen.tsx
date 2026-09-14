import type { FC } from 'react';
import { useState } from 'react';
import { 
  Grid, 
  MapPin, 
  Sprout, 
  Camera, 
  FileText, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import type { Field, Language } from '../models/types';
import { Cadastral3DViewer } from '../components/map/Cadastral3DViewer';

interface FieldsScreenProps {
  currentField: Field;
  onSelectField?: (field: Field) => void;
  onNavigate: (tab: 'home' | 'scan' | 'passport' | 'evidence' | 'more') => void;
  language?: Language;
}

export const FieldsScreen: FC<FieldsScreenProps> = ({
  currentField,
  onNavigate,
}) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(currentField.id);
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);

  const farmParcels: (Field & {
    description: string;
    soilType: string;
    sowingDate: string;
    healthScore: number;
    statusColor: string;
    bgGlow: string;
  })[] = [
    {
      ...currentField,
      description: 'Active primary monitoring parcel under digital passport ledger.',
      soilType: 'Clay Loam (Alluvial)',
      sowingDate: 'June 12, 2026',
      healthScore: 86,
      statusColor: 'text-[#76FF03]',
      bgGlow: 'border-emerald-500/40',
    },
    {
      id: 'KR-1043',
      name: 'South Boundary Parcel',
      crop: 'Cotton',
      area: '3.8 acres',
      location: 'South Boundary Parcel',
      coordinates: { lat: 17.3850, lng: 78.4867, accuracy: 4.2 },
      status: 'Optimal',
      createdAt: '2026-05-20T08:00:00Z',
      isDemo: true,
      description: 'Secondary parcel with high-efficiency drip irrigation.',
      soilType: 'Black Cotton Soil (Regur)',
      sowingDate: 'May 20, 2026',
      healthScore: 92,
      statusColor: 'text-[#4CAF50]',
      bgGlow: 'border-[#DED5C0]',
    },
    {
      id: 'KR-1044',
      name: 'North Hillside Grove',
      crop: 'Mango (Orchard)',
      area: '2.5 acres',
      location: 'North Hillside Grove',
      coordinates: { lat: 17.3912, lng: 78.4915, accuracy: 5.1 },
      status: 'Monitoring',
      createdAt: '2025-11-10T09:30:00Z',
      isDemo: true,
      description: 'Perennial horticulture orchard with micro-sprinklers.',
      soilType: 'Red Sandy Loam',
      sowingDate: 'Nov 10, 2025',
      healthScore: 88,
      statusColor: 'text-[#81C784]',
      bgGlow: 'border-[#DED5C0]',
    },
  ];

  const activeParcel = farmParcels.find(p => p.id === selectedFieldId) || farmParcels[0];

  return (
    <div className="space-y-6 pb-24 pt-2 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EAE4D5]">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#2E7D32]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2518]">
              Farm Parcels & Land Holdings
            </h1>
          </div>
          <p className="text-xs text-[#6D4C41] mt-0.5">
            Cadastral parcel management and digital field portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
            3 PARCELS REGISTERED
          </span>
        </div>
      </div>

      {/* Parcel Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {farmParcels.map((parcel) => {
          const isSelected = selectedFieldId === parcel.id;

          return (
            <div
              key={parcel.id}
              onClick={() => setSelectedFieldId(parcel.id)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-white border-[#2E7D32] shadow-md ring-2 ring-[#2E7D32]/20'
                  : 'bg-white/80 border-[#EAE4D5] hover:border-[#81C784] shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#0C2518]">
                      {parcel.id}
                    </span>
                    {parcel.id === currentField.id && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0C2518] text-[#76FF03]">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#2E7D32]">
                    {parcel.healthScore}% Health
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-[#2D1E16]">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span className="font-bold text-[#0C2518]">{parcel.crop}</span>
                    <span className="text-[#6D4C41]">({parcel.area})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#6D4C41]">
                    <MapPin className="w-3.5 h-3.5 text-[#8D6E63]" />
                    <span>{parcel.location}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#6D4C41] mt-2.5 line-clamp-2 leading-relaxed">
                  {parcel.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#8D6E63] font-medium">
                  {parcel.status}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFieldId(parcel.id);
                  }}
                  className={`text-[11px] font-bold flex items-center gap-1 ${
                    isSelected ? 'text-[#2E7D32]' : 'text-[#6D4C41] hover:text-[#0C2518]'
                  }`}
                >
                  <span>{isSelected ? 'Viewing' : 'Select'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Selected Parcel Detailed Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: 3D Digital Twin Viewer */}
        <div className="lg:col-span-7 bg-[#06140B] rounded-3xl overflow-hidden border border-emerald-950 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#76FF03]" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-[#76FF03] uppercase">
                3D CADASTRE DIGITAL TWIN • {activeParcel.id}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-300">
              {activeParcel.crop} · {activeParcel.area}
            </span>
          </div>

          <Cadastral3DViewer
            field={activeParcel}
            onToggleFullscreen={() => setIs3DModalOpen(true)}
          />
        </div>

        {/* Right: Parcel Specs & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
              <h3 className="text-xs font-bold text-[#0C2518] uppercase tracking-wider">
                Parcel Specifications
              </h3>
              <span className="text-xs font-mono font-bold text-[#2E7D32]">
                Verified Pegs: 4
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-[#2D1E16]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F4]">
                <span className="text-[#6D4C41]">Crop Variety:</span>
                <span className="font-bold">{activeParcel.crop}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F4]">
                <span className="text-[#6D4C41]">Total Acreage:</span>
                <span className="font-bold">{activeParcel.area}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F4]">
                <span className="text-[#6D4C41]">Soil Classification:</span>
                <span className="font-bold">{activeParcel.soilType}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F4]">
                <span className="text-[#6D4C41]">Sowing Date:</span>
                <span className="font-bold">{activeParcel.sowingDate}</span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigate('scan')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Scan {activeParcel.id}</span>
              </button>

              <button
                onClick={() => onNavigate('passport')}
                className="w-full py-2 px-4 rounded-xl bg-white hover:bg-[#F5F2EA] text-[#0C2518] border border-[#DED5C0] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4 text-[#2E7D32]" />
                <span>Open Field Passport</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen 3D Cadastre Modal */}
      {is3DModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4">
          <div className="flex items-center justify-between p-3 bg-[#06140B] text-white rounded-t-2xl border-b border-emerald-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#76FF03]" />
              <span className="font-mono text-sm font-bold text-[#76FF03]">
                CADASTRAL 3D TWIN • {activeParcel.id} ({activeParcel.name})
              </span>
            </div>
            <button
              onClick={() => setIs3DModalOpen(false)}
              className="p-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-[#06140B] rounded-b-2xl overflow-hidden relative">
            <Cadastral3DViewer
              field={activeParcel}
              onToggleFullscreen={() => setIs3DModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
