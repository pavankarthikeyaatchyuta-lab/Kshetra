import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import type { Field, EvidencePackage, Language } from '../models/types';
import { translations } from '../services/i18n';
import { canonicalJsonStringify, computeSha256Hex } from '../services/crypto';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  AlertTriangle, 
  Trash2, 
  MapPin, 
  Activity, 
  FileText, 
  Plus, 
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Cryptographic3DBlock } from '../components/evidence/Cryptographic3DBlock';

interface EvidenceScreenProps {
  field: Field;
  evidencePackages: EvidencePackage[];
  onSaveEvidencePackage: (pkg: EvidencePackage) => void;
  onUpdateEvidencePackage: (pkg: EvidencePackage) => void;
  onDeleteEvidencePackage: (id: string) => void;
  language: Language;
}

export const EvidenceScreen: FC<EvidenceScreenProps> = ({
  field,
  evidencePackages,
  onSaveEvidencePackage,
  onUpdateEvidencePackage,
  onDeleteEvidencePackage,
  language,
}) => {
  const t = translations[language];

  // Selected package to inspect / verify / tamper
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    evidencePackages.length > 0 ? evidencePackages[0].id : ''
  );

  // New package creator state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPhotos, setNewPhotos] = useState<string[]>(['/sample-storm.svg']);
  const [isSealing, setIsSealing] = useState(false);

  // Delete modal state
  const [deletingPkgId, setDeletingPkgId] = useState<string | null>(null);

  // Active package being inspected
  const activePackage = evidencePackages.find(p => p.id === selectedPkgId) || evidencePackages[0];

  // Tamper simulation handler
  const handleSimulateTamper = async () => {
    if (!activePackage) return;

    try {
      const parsed = JSON.parse(activePackage.currentPayload);
      // Mutate severity or condition subtly
      if (parsed.severity !== undefined) {
        parsed.severity = parsed.severity === 81 ? 15 : 99; // Alter severity
      }
      if (parsed.condition) {
        parsed.condition = 'Tampered: Minor Weather Anomaly';
      }

      const tamperedCanonical = canonicalJsonStringify(parsed);
      const newTamperedHash = await computeSha256Hex(tamperedCanonical);

      const updated: EvidencePackage = {
        ...activePackage,
        currentPayload: tamperedCanonical,
        currentHash: newTamperedHash,
        isTampered: true,
        verificationStatus: 'mismatch',
        tamperLog: `Field value 'severity' mutated to ${parsed.severity} after sealing.`,
      };

      onUpdateEvidencePackage(updated);
    } catch {
      // ignore
    }
  };

  // Integrity verification check
  const handleVerifyIntegrity = async () => {
    if (!activePackage) return;

    // Recalculate hash of current payload
    const recalculated = await computeSha256Hex(activePackage.currentPayload);
    const matches = recalculated === activePackage.originalHash;

    const updated: EvidencePackage = {
      ...activePackage,
      currentHash: recalculated,
      verificationStatus: matches ? 'verified' : 'mismatch',
      isTampered: !matches,
    };

    onUpdateEvidencePackage(updated);

    if (matches) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2E7D32', '#81C784', '#0C2518'],
        });
      } catch {
        // confetti fallback
      }
    }
  };

  // Restore original payload
  const handleRestoreOriginal = async () => {
    if (!activePackage) return;

    const recalculated = await computeSha256Hex(activePackage.originalPayload);

    const updated: EvidencePackage = {
      ...activePackage,
      currentPayload: activePackage.originalPayload,
      currentHash: recalculated,
      verificationStatus: 'verified',
      isTampered: false,
      tamperLog: undefined,
    };

    onUpdateEvidencePackage(updated);
  };

  // Create new sealed evidence package
  const handleBuildNewPackage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSealing(true);

    const now = new Date().toISOString();
    const payloadObj = {
      fieldId: field.id,
      title: newTitle.trim(),
      crop: field.crop,
      location: field.location,
      coordinates: field.coordinates,
      capturedAt: now,
      photosCount: newPhotos.length,
      sensorContext: {
        stability: 'Steady',
        motionDetected: false,
        hardwareProvider: 'Browser Device Context',
      },
    };

    const canonical = canonicalJsonStringify(payloadObj);
    const hash = await computeSha256Hex(canonical);

    const newPackage: EvidencePackage = {
      id: `ev-${Date.now()}`,
      fieldId: field.id,
      createdAt: now,
      title: newTitle.trim(),
      photos: newPhotos,
      metadata: {
        location: field.location,
        coordinates: field.coordinates,
        capturedAt: now,
        sensorContext: {
          deviceMotion: 'None',
          orientation: 'Portrait',
          stability: 'Device Steady',
          hardwareProvider: 'Browser Web Crypto API',
        },
        deviceContext: 'Mobile Web Shell / Hardware Keystore Target',
      },
      assessment: {
        crop: field.crop,
        condition: 'Severe Event Record',
        severity: 75,
        confidence: 96,
        observations: ['Multi-angle photographic record sealed at event source.'],
      },
      originalPayload: canonical,
      currentPayload: canonical,
      originalHash: hash,
      currentHash: hash,
      verificationStatus: 'verified',
      syncStatus: 'stored_local',
      isTampered: false,
      isDemo: false,
    };

    setTimeout(() => {
      onSaveEvidencePackage(newPackage);
      setSelectedPkgId(newPackage.id);
      setIsCreatingNew(false);
      setNewTitle('');
      setIsSealing(false);
    }, 400);
  };

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto px-4">
      {/* High-Contrast Serious Header */}
      <div className="rounded-2xl p-4 bg-[#0A1A10] text-[#FBF9F4] border border-[#2E7D32]/40 shadow-lg space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#81C784]" />
            <h1 className="text-sm font-extrabold tracking-widest uppercase text-[#81C784]">
              {t.evidenceModeTitle}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
              FOR DEMO PURPOSES ONLY
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E65100] text-white">
              IMPORTANT EVENT
            </span>
          </div>
        </div>
        <p className="text-xs text-[#D7E3DA] leading-relaxed pt-1">
          {t.evidencePurpose}
        </p>

        {/* Boundary Notice */}
        <div className="pt-2 mt-2 border-t border-white/10 text-[10px] text-[#A5D6A7]/80 flex items-center justify-between">
          <span>{t.browserPocNotice}</span>
          <Lock className="w-3 h-3 text-[#81C784]" />
        </div>
      </div>

      {/* Package Selector Pills if multiple */}
      {evidencePackages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {evidencePackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPkgId(pkg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPkgId === pkg.id
                  ? 'bg-[#0C2518] text-[#81C784] shadow-sm'
                  : 'bg-white text-[#6D4C41] border border-[#DED5C0]'
              }`}
            >
              {pkg.title}
            </button>
          ))}
        </div>
      )}

      {/* ACTIVE EVIDENCE PACKAGE CARD */}
      {activePackage && (
        <div className="rounded-2xl bg-white border border-[#DED5C0] p-4 shadow-sm space-y-4">
          {/* Title & Delete Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0C2518]">
                  {activePackage.title}
                </h3>
                {activePackage.isDemo && (
                  <span className="px-1.5 py-0.2 rounded bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold">
                    {t.demoBadge}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#6D4C41] font-mono mt-0.5">
                Sealed: {new Date(activePackage.createdAt).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setDeletingPkgId(activePackage.id)}
              className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
              title="Delete Evidence Package"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Thumbnails */}
          <div>
            <div className="text-[10px] font-bold text-[#6D4C41] uppercase mb-1.5">
              Sealed Multi-Angle Photos ({activePackage.photos.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {activePackage.photos.map((url, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-[#DED5C0] aspect-4/3 bg-black">
                  <img src={url} alt={`Evidence photo ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono">
                    ANGLE {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#EAE4D5] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#6D4C41] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2E7D32]" /> {t.location}:
              </span>
              <span className="font-medium text-[#1A221D] max-w-[200px] truncate text-right">
                {activePackage.metadata.location}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#6D4C41] flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#2E7D32]" /> Sensor Context:
              </span>
              <span className="font-mono text-[11px] text-[#1A221D]">
                {activePackage.metadata.sensorContext.stability}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#6D4C41] flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#2E7D32]" /> Condition:
              </span>
              <span className="font-semibold text-[#1A221D]">
                {activePackage.assessment.condition}
              </span>
            </div>
          </div>

          {/* 3D Cryptographic Evidence Vault Monolith */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-950/80">
            <Cryptographic3DBlock
              hash={activePackage.currentHash}
              isTampered={!!activePackage.isTampered}
              isVerified={activePackage.verificationStatus === 'verified'}
              onRestore={handleRestoreOriginal}
            />
          </div>

          {/* HASH UI: SHA-256 with Real Hashes */}
          <div className="p-3.5 rounded-2xl bg-[#0C2518] text-[#FBF9F4] space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-bold tracking-widest text-[#81C784] uppercase flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                {t.sha256Seal}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                Web Crypto API
              </span>
            </div>

            {/* Original Hash */}
            <div>
              <div className="text-[9px] text-[#A5D6A7] uppercase font-semibold">
                {t.originalHash}:
              </div>
              <div className="font-mono text-xs text-[#FBF9F4] break-all select-all mt-0.5 bg-black/40 p-2 rounded-lg border border-white/5">
                {activePackage.originalHash}
              </div>
            </div>

            {/* Current Hash */}
            <div>
              <div className="text-[9px] text-[#A5D6A7] uppercase font-semibold">
                {t.currentHash}:
              </div>
              <div
                className={`font-mono text-xs break-all select-all mt-0.5 p-2 rounded-lg border ${
                  activePackage.verificationStatus === 'verified'
                    ? 'text-[#81C784] bg-black/40 border-[#2E7D32]/40'
                    : 'text-[#FF8A80] bg-[#B71C1C]/30 border-[#C62828]'
                }`}
              >
                {activePackage.currentHash}
              </div>
            </div>

            {/* Integrity Status Alert Banner */}
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                activePackage.verificationStatus === 'verified'
                  ? 'bg-[#123824] border-[#2E7D32] text-[#81C784]'
                  : 'bg-[#491212] border-[#C62828] text-[#FF8A80]'
              }`}
            >
              {activePackage.verificationStatus === 'verified' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#81C784] shrink-0" />
                  <span>✓ {t.integrityVerified}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-[#FF8A80] shrink-0" />
                  <div>
                    <div>✗ {t.hashMismatch}</div>
                    <div className="text-[10px] font-normal text-white/80 mt-0.5">
                      {t.tamperAlert}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* TAMPER DEMONSTRATION CONTROLS */}
          <div className="space-y-2 pt-1">
            <div className="text-[10px] font-bold text-[#6D4C41] uppercase tracking-wider text-center">
              Hackathon Integrity Demo Controls
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimulateTamper}
                className="py-2.5 px-3 rounded-xl bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#E65100] border border-[#FFE0B2] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.simulateTamperCTA}</span>
              </button>

              <button
                onClick={handleVerifyIntegrity}
                className="py-2.5 px-3 rounded-xl bg-[#0C2518] hover:bg-[#123824] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#81C784]" />
                <span>{t.verifyIntegrityCTA}</span>
              </button>
            </div>

            {activePackage.isTampered && (
              <button
                onClick={handleRestoreOriginal}
                className="w-full py-2 px-3 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] border border-[#C8E6C9] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.restoreOriginalCTA}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Button to Trigger New Package Form */}
      {!isCreatingNew && (
        <button
          onClick={() => setIsCreatingNew(true)}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F5F2EA] text-[#0C2518] border border-[#DED5C0] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.buildPackageCTA}</span>
        </button>
      )}

      {/* CREATE NEW EVIDENCE PACKAGE FORM */}
      {isCreatingNew && (
        <div className="rounded-2xl bg-white border border-[#DED5C0] p-4 shadow-md space-y-3">
          <h3 className="text-sm font-bold text-[#0C2518]">
            {t.buildPackageCTA}
          </h3>

          <form onSubmit={handleBuildNewPackage} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6D4C41] uppercase mb-1">
                Event Title / Reason
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Extreme Hailstorm Damage Inspection"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DED5C0] text-xs focus:ring-2 focus:ring-[#2E7D32] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6D4C41] uppercase mb-1">
                Photos to Seal (1 to 3)
              </label>
              <div className="flex gap-2">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#DED5C0] bg-black">
                  <img src="/sample-storm.svg" alt="Photo 1" className="w-full h-full object-cover" />
                </div>
                {newPhotos.length > 1 && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#DED5C0] bg-black">
                    <img src="/sample-leafcurl.svg" alt="Photo 2" className="w-full h-full object-cover" />
                  </div>
                )}
                {newPhotos.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setNewPhotos([...newPhotos, '/sample-leafcurl.svg'])}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-[#DED5C0] text-[#6D4C41] flex flex-col items-center justify-center text-[10px] hover:bg-[#F5F2EA]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FBF9F4] text-[11px] text-[#6D4C41] space-y-1 border border-[#EAE4D5]">
              <div>Location: <strong>{field.location}</strong></div>
              <div>Device Sensors: <strong>Available via Browser API</strong></div>
              <div>Integrity Scheme: <strong>SHA-256 Web Crypto</strong></div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="flex-1 py-2 rounded-xl border border-[#DED5C0] text-xs font-semibold text-[#6D4C41]"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={isSealing}
                className="flex-1 py-2 rounded-xl bg-[#0C2518] hover:bg-[#123824] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#81C784]" />
                <span>{isSealing ? 'Sealing...' : 'Seal Package'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DELETING EVIDENCE PACKAGE */}
      {deletingPkgId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl space-y-3 border border-[#DED5C0] text-center">
            <div className="w-10 h-10 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-[#0C2518]">
              {t.deleteEvidenceTitle}
            </h3>

            <p className="text-xs text-[#6D4C41]">
              {t.deleteEvidenceDesc}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingPkgId(null)}
                className="flex-1 py-2 rounded-xl border border-[#DED5C0] text-xs font-semibold text-[#6D4C41] hover:bg-[#F5F2EA]"
              >
                {t.cancelBtn}
              </button>

              <button
                onClick={() => {
                  onDeleteEvidencePackage(deletingPkgId);
                  setDeletingPkgId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-sm"
              >
                {t.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
