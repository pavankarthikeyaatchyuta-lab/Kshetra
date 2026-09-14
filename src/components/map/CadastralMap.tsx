import type { FC } from 'react';
import { useState } from 'react';
import { MapPin, Plus, Minus, Layers, Maximize2 } from 'lucide-react';
import type { Field } from '../../models/types';

interface CadastralMapProps {
  field: Field;
  onUseMyLocation: () => void;
  isLocating: boolean;
}

export const CadastralMap: FC<CadastralMapProps> = ({
  field,
  onUseMyLocation,
  isLocating,
}) => {
  const [zoomLevel, setZoomLevel] = useState(16);
  const [mapLayer, setMapLayer] = useState<'satellite' | 'terrain'>('satellite');
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  const hasCoords = !!field.coordinates;
  const latStr = hasCoords && field.coordinates 
    ? `${Math.abs(field.coordinates.lat).toFixed(4)}° ${field.coordinates.lat >= 0 ? 'N' : 'S'}`
    : '--';
  const lngStr = hasCoords && field.coordinates
    ? `${Math.abs(field.coordinates.lng).toFixed(4)}° ${field.coordinates.lng >= 0 ? 'E' : 'W'}`
    : '--';
  const accStr = hasCoords && field.coordinates?.accuracy
    ? `±${field.coordinates.accuracy}m`
    : '-- m';

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE4D5] shadow-xs flex flex-col justify-between space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2E7D32]" />
          <h3 className="text-xs font-bold text-[#0C2518]">
            Field Location
          </h3>
        </div>
        <button
          onClick={() => setIsFullscreenModalOpen(true)}
          className="text-[11px] font-semibold text-[#2E7D32] hover:underline flex items-center gap-1"
        >
          <span>View Larger</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {/* Satellite Imagery with Cadastral Boundary Polygon */}
      <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-[#DED5C0] shadow-inner bg-[#1A3018]">
        <img
          src="/satellite-field.svg"
          alt="Field Cadastral Satellite Map"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel / 16})` }}
        />

        {/* Map Zoom Controls on Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 bg-white/90 backdrop-blur-xs rounded-lg border border-[#DED5C0] shadow-xs overflow-hidden">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
            className="p-1.5 hover:bg-[#F5F2EA] text-[#2D1E16] transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="h-[1px] bg-[#EAE4D5]" />
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 14))}
            className="p-1.5 hover:bg-[#F5F2EA] text-[#2D1E16] transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Map Layer Switcher on Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#DED5C0] shadow-xs flex items-center gap-1.5 text-[10px] font-semibold text-[#2D1E16]">
          <Layers className="w-3 h-3 text-[#2E7D32]" />
          <select
            value={mapLayer}
            onChange={(e) => setMapLayer(e.target.value as 'satellite' | 'terrain')}
            className="bg-transparent focus:outline-hidden cursor-pointer"
          >
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        {/* Live Boundary Badge on Top Right */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#0C2518]/85 text-[#76FF03] text-[9px] font-mono font-bold tracking-wider backdrop-blur-xs border border-[#76FF03]/40">
          PARCEL {field.id}
        </div>
      </div>

      {/* Bottom Coordinates & Capture Prompt Box */}
      <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#EAE4D5] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-[#0C2518] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{field.location === 'Location not set' ? 'Location not set' : field.location}</span>
            </div>
            <div className="text-[10px] text-[#6D4C41] mt-0.5">
              {hasCoords
                ? 'Device GPS coordinates captured and verified.'
                : "Tap 'Use my location' to capture GPS coordinates."}
            </div>
          </div>

          <button
            onClick={onUseMyLocation}
            disabled={isLocating}
            className="px-2.5 py-1.5 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 active:scale-95"
          >
            <MapPin className="w-3 h-3" />
            <span>{isLocating ? 'Capturing...' : 'Use my location'}</span>
          </button>
        </div>

        {/* Coordinates Readout Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EAE4D5] text-center">
          <div className="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
            <div className="text-[9px] text-[#8D6E63] uppercase">Latitude</div>
            <div className="text-xs font-mono font-bold text-[#0C2518] mt-0.5">{latStr}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
            <div className="text-[9px] text-[#8D6E63] uppercase">Longitude</div>
            <div className="text-xs font-mono font-bold text-[#0C2518] mt-0.5">{lngStr}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-[#F0ECE1]">
            <div className="text-[9px] text-[#8D6E63] uppercase">Accuracy</div>
            <div className="text-xs font-mono font-bold text-[#2E7D32] mt-0.5">{accStr}</div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-5 space-y-4 shadow-2xl border border-[#DED5C0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2E7D32]" />
                <h2 className="text-sm font-bold text-[#0C2518]">
                  Cadastral Survey Map — Parcel {field.id} ({field.crop})
                </h2>
              </div>
              <button
                onClick={() => setIsFullscreenModalOpen(false)}
                className="text-xs font-bold text-[#6D4C41] hover:text-black p-1"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-16/9 rounded-2xl overflow-hidden border border-[#DED5C0]">
              <img src="/satellite-field.svg" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
