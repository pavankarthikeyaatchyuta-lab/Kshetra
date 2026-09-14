import { useState } from 'react';
import type { FC } from 'react';
import type { Field, Observation, EvidencePackage, Language } from '../models/types';
import { translations } from '../services/i18n';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Database, 
  Lock 
} from 'lucide-react';

interface OfficeScreenProps {
  field: Field;
  observations: Observation[];
  evidencePackages: EvidencePackage[];
  onBackToFieldApp: () => void;
  language: Language;
}

export const OfficeScreen: FC<OfficeScreenProps> = ({
  field,
  observations,
  evidencePackages,
  onBackToFieldApp,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'overview' | 'fields' | 'evidence' | 'activity'>('overview');

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#1A221D] flex flex-col">
      {/* Office Header */}
      <header className="bg-[#0C2518] text-[#FBF9F4] px-6 py-4 border-b border-[#18442D] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#18442D] text-[#81C784]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider uppercase font-serif">
                Kshetra Office
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
                FOR DEMO PURPOSES ONLY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#81C784]/20 text-[#81C784] border border-[#81C784]/30">
                AUDIT & STAKEHOLDER PORTAL
              </span>
            </div>
            <p className="text-[11px] text-[#A5D6A7]">
              Field Verification & Evidence Continuity Review
            </p>
          </div>
        </div>

        <button
          onClick={onBackToFieldApp}
          className="px-3.5 py-1.5 rounded-xl bg-[#81C784] hover:bg-[#4CAF50] text-[#0C2518] font-bold text-xs shadow-xs transition-all"
        >
          ← Return to Field App
        </button>
      </header>

      {/* Office Navigation Tabs */}
      <div className="bg-white border-b border-[#DED5C0] px-6 flex gap-6 text-xs font-semibold">
        {(['overview', 'fields', 'evidence', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 capitalize transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#2E7D32] text-[#0C2518] font-bold'
                : 'border-transparent text-[#6D4C41] hover:text-[#0C2518]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Honest Demo Notice Banner */}
        <div className="rounded-xl p-3 bg-white border border-[#DED5C0] flex items-center justify-between text-xs text-[#6D4C41]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#2E7D32]" />
            <span>
              <strong>Demo Dataset Active:</strong> Showing audit trail for Field {field.id}. No fabricated operational claims.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#FFF3E0] text-[#E65100] text-[10px] font-bold">
            {t.demoBadge} DATASET
          </span>
        </div>

        {/* OVERVIEW / FIELDS TAB */}
        {(activeTab === 'overview' || activeTab === 'fields') && (
          <div className="space-y-6">
            {/* Field Record Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#DED5C0] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#0C2518]">
                      Field {field.id} — {field.name}
                    </h2>
                    {field.isDemo && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF3E0] text-[#E65100]">
                        DEMO FIELD
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6D4C41] mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" /> {field.location}
                    </span>
                    <span>•</span>
                    <span>Established: {new Date(field.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Passport Verified</span>
                  </div>
                </div>
              </div>

              {/* Field Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#EAE4D5]">
                  <div className="text-[10px] text-[#6D4C41] uppercase font-semibold">{t.crop}</div>
                  <div className="text-sm font-bold text-[#0C2518] mt-0.5">{field.crop}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#EAE4D5]">
                  <div className="text-[10px] text-[#6D4C41] uppercase font-semibold">{t.area}</div>
                  <div className="text-sm font-bold text-[#0C2518] mt-0.5">{field.area}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#EAE4D5]">
                  <div className="text-[10px] text-[#6D4C41] uppercase font-semibold">Total Observations</div>
                  <div className="text-sm font-bold text-[#0C2518] mt-0.5">{observations.length} Recorded</div>
                </div>

                <div className="p-3 rounded-xl bg-[#FBF9F4] border border-[#EAE4D5]">
                  <div className="text-[10px] text-[#6D4C41] uppercase font-semibold">Evidence Packages</div>
                  <div className="text-sm font-bold text-[#0C2518] mt-0.5">{evidencePackages.length} Sealed</div>
                </div>
              </div>
            </div>

            {/* Evidence & Integrity Status Table */}
            <div className="bg-white rounded-2xl p-6 border border-[#DED5C0] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0C2518] uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2E7D32]" />
                Sealed Evidence Packages & SHA-256 Audit
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F2EA] text-[#6D4C41] uppercase font-bold border-b border-[#DED5C0]">
                    <tr>
                      <th className="py-2.5 px-3">Package Title</th>
                      <th className="py-2.5 px-3">Date Sealed</th>
                      <th className="py-2.5 px-3">Integrity State</th>
                      <th className="py-2.5 px-3">SHA-256 Digest</th>
                      <th className="py-2.5 px-3">Hardware Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE1]">
                    {evidencePackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-[#FBF9F4]">
                        <td className="py-3 px-3 font-semibold text-[#0C2518]">
                          {pkg.title}
                        </td>
                        <td className="py-3 px-3 text-[#6D4C41]">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          {pkg.verificationStatus === 'verified' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              VERIFIED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] font-bold text-[11px]">
                              <XCircle className="w-3.5 h-3.5" />
                              HASH MISMATCH
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#6D4C41]">
                          {pkg.originalHash.substring(0, 16)}...
                        </td>
                        <td className="py-3 px-3 text-[#6D4C41]">
                          {pkg.metadata.sensorContext.hardwareProvider}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidencePackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl p-5 border border-[#DED5C0] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-2">
                  <h4 className="font-bold text-sm text-[#0C2518]">{pkg.title}</h4>
                  <span className="text-[10px] text-[#6D4C41] font-mono">
                    {new Date(pkg.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  {pkg.photos.map((url, idx) => (
                    <img key={idx} src={url} alt="Evidence" className="w-20 h-20 rounded-xl object-cover border border-[#DED5C0]" />
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#0C2518] text-[#FBF9F4] font-mono text-[11px] space-y-1">
                  <div className="text-[9px] text-[#A5D6A7] uppercase">SHA-256 Checksum:</div>
                  <div className="break-all">{pkg.originalHash}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#6D4C41]">Status:</span>
                  <span className={`font-bold ${pkg.verificationStatus === 'verified' ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
                    {pkg.verificationStatus === 'verified' ? '✓ Integrity Verified' : '✗ Altered After Sealing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ACTIVITY LOG TAB */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-2xl p-6 border border-[#DED5C0] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0C2518] uppercase tracking-wider">
              Field Audit Trail Log
            </h3>
            <div className="space-y-3">
              {observations.map((obs) => (
                <div key={obs.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FBF9F4] border border-[#EAE4D5] text-xs">
                  <div className="flex items-center gap-3">
                    <img src={obs.photoUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-[#0C2518]">{obs.condition}</div>
                      <div className="text-[10px] text-[#6D4C41]">
                        {new Date(obs.timestamp).toLocaleString()} · {obs.location}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#2E7D32]">
                    {obs.confidence}% Conf.
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
