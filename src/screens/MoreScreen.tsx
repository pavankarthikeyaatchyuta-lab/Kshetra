import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Language, HardwarePermissions } from '../models/types';
import { translations } from '../services/i18n';
import { 
  Camera, 
  MapPin, 
  Activity, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  Globe, 
  Cpu, 
  AlertTriangle, 
  ChevronRight, 
  Building2 
} from 'lucide-react';

interface MoreScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  onResetDemoData: () => void;
  onOpenOffice: () => void;
}

export const MoreScreen: FC<MoreScreenProps> = ({
  language,
  onLanguageChange,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  onResetDemoData,
  onOpenOffice,
}) => {
  const t = translations[language];

  const [permissions, setPermissions] = useState<HardwarePermissions>({
    camera: 'prompt',
    location: 'prompt',
    motion: 'granted',
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);

  // Probe permissions
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((res) => {
        setPermissions(prev => ({
          ...prev,
          location: res.state === 'granted' ? 'granted' : res.state === 'denied' ? 'denied' : 'prompt',
        }));
      }).catch(() => {});

      navigator.permissions.query({ name: 'camera' as PermissionName }).then((res) => {
        setPermissions(prev => ({
          ...prev,
          camera: res.state === 'granted' ? 'granted' : res.state === 'denied' ? 'denied' : 'prompt',
        }));
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto px-4">
      {/* Header */}
      <div className="pt-2 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0C2518]">
            {t.settingsTitle}
          </h1>
          <p className="text-xs text-[#6D4C41] mt-0.5">
            Device permissions, offline controls, and system roadmap.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] shrink-0">
          FOR DEMO PURPOSES ONLY
        </span>
      </div>

      {/* Demo Sandbox Alert Card */}
      <div className="rounded-2xl p-3.5 bg-[#FFF8E1] border border-[#FFE082] shadow-2xs flex items-center gap-3">
        <span className="px-2 py-0.5 rounded bg-[#E65100] text-white font-mono font-bold text-[9px] uppercase shrink-0">
          DEMO MODE
        </span>
        <p className="text-xs text-[#5D4037] font-medium leading-tight">
          Running in interactive demonstration mode. All sensor values and ledger transactions are sandbox records.
        </p>
      </div>

      {/* Language Selector Card */}
      <div className="rounded-2xl bg-white border border-[#EAE4D5] p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0C2518] uppercase tracking-wider">
          <Globe className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.languageSelect}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'en', label: 'English', sub: 'English' },
            { key: 'hi', label: 'हिन्दी', sub: 'Hindi' },
            { key: 'te', label: 'తెలుగు', sub: 'Telugu' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onLanguageChange(item.key as Language)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                language === item.key
                  ? 'bg-[#0C2518] border-[#0C2518] text-white shadow-xs'
                  : 'bg-[#FBF9F4] border-[#DED5C0] text-[#2D1E16] hover:bg-[#F5F2EA]'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className={`text-[9px] ${language === item.key ? 'text-[#81C784]' : 'text-[#6D4C41]'}`}>
                {item.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hardware Permissions Status */}
      <div className="rounded-2xl bg-white border border-[#EAE4D5] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
          <h2 className="text-xs font-bold text-[#0C2518] uppercase tracking-wider">
            {t.hardwarePermissions}
          </h2>
          <span className="text-[10px] text-[#6D4C41]">Web API Probing</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Camera */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F4]">
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-[#2E7D32]" />
              <span className="font-semibold">{t.cameraPerm}</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                permissions.camera === 'granted'
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-[#FFF3E0] text-[#E65100]'
              }`}
            >
              {permissions.camera === 'granted' ? t.granted : t.prompt}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F4]">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#2E7D32]" />
              <span className="font-semibold">{t.locationPerm}</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                permissions.location === 'granted'
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-[#FFF3E0] text-[#E65100]'
              }`}
            >
              {permissions.location === 'granted' ? t.granted : t.prompt}
            </span>
          </div>

          {/* Motion Sensors */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F4]">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#2E7D32]" />
              <span className="font-semibold">{t.motionPerm}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
              {t.granted}
            </span>
          </div>
        </div>
      </div>

      {/* Offline Operation & Demo Switch */}
      <div className="rounded-2xl bg-white border border-[#EAE4D5] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0C2518] uppercase tracking-wider">
            {isOnline && !isSimulatedOffline ? (
              <Wifi className="w-4 h-4 text-[#2E7D32]" />
            ) : (
              <WifiOff className="w-4 h-4 text-[#E65100]" />
            )}
            <span>{t.offlineMode}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              isOnline && !isSimulatedOffline
                ? 'bg-[#E8F5E9] text-[#2E7D32]'
                : 'bg-[#FFF3E0] text-[#E65100]'
            }`}
          >
            {isOnline && !isSimulatedOffline ? 'ONLINE' : 'OFFLINE MODE'}
          </span>
        </div>

        <p className="text-xs text-[#6D4C41] leading-relaxed">
          Kshetra is built offline-first. Camera scanning, on-device analysis, local passport records, and cryptographic sealing run without internet connection.
        </p>

        <button
          onClick={onToggleSimulatedOffline}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
            isSimulatedOffline
              ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
              : 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]'
          }`}
        >
          {isSimulatedOffline ? 'Disable Offline Simulation' : t.simulateOffline}
        </button>
      </div>

      {/* Stakeholder Office Portal Shortcut */}
      <div className="rounded-2xl bg-white border border-[#EAE4D5] p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0C2518] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Kshetra Office</span>
          </div>
          <span className="text-[10px] font-mono text-[#8D6E63]">Desktop / Tablet</span>
        </div>
        <p className="text-xs text-[#6D4C41]">
          Audit view for agronomists and insurers to inspect sealed Field Passports and SHA-256 evidence.
        </p>
        <button
          onClick={onOpenOffice}
          className="w-full py-2 px-3 rounded-xl bg-[#0C2518] hover:bg-[#123824] text-white text-xs font-bold flex items-center justify-center gap-2"
        >
          <span>Open Kshetra Office</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#81C784]" />
        </button>
      </div>

      {/* Architecture Comparison Button */}
      <button
        onClick={() => setShowArchModal(true)}
        className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-[#0C2518] to-[#123824] text-[#FBF9F4] shadow-md flex items-center justify-between text-xs font-bold transition-all"
      >
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-[#81C784]" />
          <span>{t.architectureComparison}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-[#81C784]" />
      </button>

      {/* Destructive Clear Demo Data Action */}
      <div className="pt-2">
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl border border-[#FFCDD2] bg-[#FFF5F5] hover:bg-[#FFEBEE] text-[#C62828] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.clearDemoData}</span>
        </button>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl space-y-3 border border-[#DED5C0] text-center">
            <div className="w-10 h-10 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-[#0C2518]">
              {t.clearDemoData}
            </h3>

            <p className="text-xs text-[#6D4C41]">
              {t.resetPrototypeDesc}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl border border-[#DED5C0] text-xs font-semibold text-[#6D4C41] hover:bg-[#F5F2EA]"
              >
                {t.cancelBtn}
              </button>

              <button
                onClick={() => {
                  onResetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-sm"
              >
                {t.resetConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARCHITECTURE COMPARISON MODAL */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-[#DED5C0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="text-sm font-bold text-[#0C2518]">
                  System Architecture Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="text-xs font-bold text-[#6D4C41] hover:text-[#0C2518]"
              >
                ✕
              </button>
            </div>

            {/* Browser POC Stack */}
            <div className="p-3.5 rounded-2xl bg-[#FBF9F4] border border-[#EAE4D5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0C2518] uppercase">
                  Current Browser Prototype
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold">
                  POC DEMO
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-[#2D1E16]">
                <li>• <strong>Camera:</strong> Browser MediaDevices getUserMedia API</li>
                <li>• <strong>Location:</strong> HTML5 Geolocation API with accuracy meter</li>
                <li>• <strong>Sensors:</strong> DeviceMotionEvent / DeviceOrientationEvent</li>
                <li>• <strong>Integrity:</strong> Web Crypto API SHA-256 subtle digest</li>
                <li>• <strong>Persistence:</strong> IndexedDB / LocalStorage</li>
                <li>• <strong>AI Layer:</strong> Deterministic agronomic rule-engine demo</li>
              </ul>
            </div>

            {/* Native Android Roadmap */}
            <div className="p-3.5 rounded-2xl bg-[#0C2518] text-[#FBF9F4] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#81C784] uppercase">
                  Native Android Target Stack
                </span>
                <span className="px-2 py-0.5 rounded bg-[#2E7D32] text-white text-[9px] font-bold">
                  PRODUCTION ROADMAP
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-[#D7E3DA]">
                <li>• <strong>UI / Shell:</strong> Kotlin + Jetpack Compose</li>
                <li>• <strong>Camera:</strong> Jetpack CameraX with custom lens tuning</li>
                <li>• <strong>Location:</strong> Google Play Fused Location Provider API</li>
                <li>• <strong>Sensors:</strong> SensorManager with Kalman filter stabilization</li>
                <li>• <strong>Security:</strong> Android Keystore hardware-backed private key signing</li>
                <li>• <strong>Persistence:</strong> Room Database with SQLite cipher encryption</li>
                <li>• <strong>On-Device AI:</strong> LiteRT / Qualcomm inference runtime + Gemma 3n local LLM</li>
                <li>• <strong>Background Sync:</strong> WorkManager offline queue</li>
              </ul>
            </div>

            <button
              onClick={() => setShowArchModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0C2518] text-white text-xs font-bold"
            >
              Close Roadmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
