import type { FC } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Droplets, 
  ArrowUpRight 
} from 'lucide-react';
import type { Field, Language } from '../models/types';

interface InsightsScreenProps {
  field: Field;
  onNavigate: (tab: 'home' | 'scan' | 'passport' | 'evidence' | 'more') => void;
  language?: Language;
}

export const InsightsScreen: FC<InsightsScreenProps> = ({
  field,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 pb-24 pt-2 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EAE4D5]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2E7D32]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2518]">
              Agronomic Intelligence & Insights
            </h1>
          </div>
          <p className="text-xs text-[#6D4C41] mt-0.5">
            Vegetation dynamics, chlorophyll reflectance, and disease risk indices for Field {field.id}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
            FOR DEMO PURPOSES ONLY
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
            LIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#EAE4D5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6D4C41]">
            <span className="font-semibold uppercase tracking-wider">Mean NDVI Index</span>
            <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-[#0C2518]">0.84</span>
            <span className="text-xs font-bold text-[#2E7D32] flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +4.2% (14d)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#EAE4D5] overflow-hidden">
            <div className="h-full bg-[#76FF03] rounded-full" style={{ width: '84%' }} />
          </div>
          <div className="text-[10px] text-[#8D6E63]">Optimal canopy chlorophyll density</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#EAE4D5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6D4C41]">
            <span className="font-semibold uppercase tracking-wider">Disease Pressure</span>
            <AlertTriangle className="w-4 h-4 text-[#E65100]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-[#E65100]">Low-Mod</span>
            <span className="text-xs text-[#6D4C41]">24% Risk</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#EAE4D5] overflow-hidden">
            <div className="h-full bg-[#FFB300] rounded-full" style={{ width: '24%' }} />
          </div>
          <div className="text-[10px] text-[#8D6E63]">Favorable weather; monitor blast spore activity</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#EAE4D5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6D4C41]">
            <span className="font-semibold uppercase tracking-wider">Soil Moisture Adequacy</span>
            <Droplets className="w-4 h-4 text-[#0288D1]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-[#0C2518]">78%</span>
            <span className="text-xs font-bold text-[#2E7D32]">Saturated</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#EAE4D5] overflow-hidden">
            <div className="h-full bg-[#0288D1] rounded-full" style={{ width: '78%' }} />
          </div>
          <div className="text-[10px] text-[#8D6E63]">Field water depth 2.4 cm (ideal for tillering)</div>
        </div>
      </div>

      {/* Disease Risk Matrix */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
          <h3 className="text-xs font-bold text-[#0C2518] uppercase tracking-wider">
            Crop-Specific Pathogen Susceptibility Matrix
          </h3>
          <span className="text-[11px] font-mono text-[#2E7D32] font-semibold">
            Paddy (MTU-1010)
          </span>
        </div>

        <div className="space-y-3">
          {[
            {
              pathogen: 'Rice Blast (Pyricularia oryzae)',
              level: 'Moderate Risk',
              color: 'text-[#E65100]',
              bg: 'bg-[#FFF3E0]',
              barColor: 'bg-[#FF9800]',
              pct: 42,
              recommendation: 'Maintain standing water at 2-3 cm; avoid excessive nitrogen top-dressing.',
            },
            {
              pathogen: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
              level: 'Low Risk',
              color: 'text-[#2E7D32]',
              bg: 'bg-[#E8F5E9]',
              barColor: 'bg-[#4CAF50]',
              pct: 18,
              recommendation: 'Cut irrigation runoff between plots to limit bacterial dissemination.',
            },
            {
              pathogen: 'Brown Plant Hopper (Nilaparvata lugens)',
              level: 'Low Risk',
              color: 'text-[#2E7D32]',
              bg: 'bg-[#E8F5E9]',
              barColor: 'bg-[#4CAF50]',
              pct: 12,
              recommendation: 'Alley formation (pathways) maintains air circulation across dense tillers.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#FBF9F4] border border-[#F0ECE1] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0C2518]">{item.pathogen}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.bg} ${item.color}`}>
                  {item.level}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#EAE4D5] overflow-hidden">
                <div className={`h-full ${item.barColor} rounded-full`} style={{ width: `${item.pct}%` }} />
              </div>
              <p className="text-[11px] text-[#6D4C41]">{item.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0C2518] text-white">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-[#81C784]">Ready for Field Diagnostics?</div>
          <div className="text-[11px] text-white/80">Capture fresh observation to update telemetry curves.</div>
        </div>
        <button
          onClick={() => onNavigate('scan')}
          className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          Scan Field Now
        </button>
      </div>
    </div>
  );
};
