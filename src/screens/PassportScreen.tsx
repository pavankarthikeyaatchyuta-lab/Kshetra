import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import type { Field, Observation, Intervention, Language } from '../models/types';
import { translations } from '../services/i18n';
import { 
  ShieldCheck, 
  MapPin, 
  Trash2, 
  Plus, 
  AlertCircle,
  FileCheck,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';

interface PassportScreenProps {
  field: Field;
  observations: Observation[];
  interventions: Intervention[];
  onDeleteObservation: (id: string) => void;
  onDeleteIntervention: (id: string) => void;
  onAddIntervention: (intervention: Intervention) => void;
  onNavigateToScan: () => void;
  language: Language;
  initialOpenIntervention?: boolean;
  targetObservationId?: string | null;
}

export const PassportScreen: FC<PassportScreenProps> = ({
  field,
  observations,
  interventions,
  onDeleteObservation,
  onDeleteIntervention,
  onAddIntervention,
  onNavigateToScan,
  language,
  initialOpenIntervention = false,
  targetObservationId = null,
}) => {
  const t = translations[language];

  // Modals state
  const [deletingObsId, setDeletingObsId] = useState<string | null>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(initialOpenIntervention);
  const [selectedObsForIntervention, setSelectedObsForIntervention] = useState<string | undefined>(undefined);
  const [interventionAction, setInterventionAction] = useState('');
  const [interventionNotes, setInterventionNotes] = useState('');
  const [expandedObsId, setExpandedObsId] = useState<string | null>(targetObservationId);

  // Combine observations and interventions into a chronological timeline
  type TimelineItem = 
    | { type: 'observation'; data: Observation; date: Date }
    | { type: 'intervention'; data: Intervention; date: Date }
    | { type: 'sowing'; date: Date };

  const sowingDate = new Date(field.createdAt || '2026-06-12T07:30:00Z');

  // Sort observations newest first for dynamic last scan and health
  const sortedObs = [...observations].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latestObs = sortedObs[0];

  const formatLastScan = (dateStr?: string) => {
    if (!dateStr) return 'None';
    const scanDate = new Date(dateStr);
    const now = new Date();
    const diffHours = (now.getTime() - scanDate.getTime()) / (1000 * 60 * 60);
    if (diffHours < 2) return 'Just now';
    if (diffHours < 24) return 'Today';
    return scanDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const lastScanDisplay = formatLastScan(latestObs?.timestamp);

  const timelineItems: TimelineItem[] = [
    { type: 'sowing' as const, date: sowingDate },
    ...observations.map(o => ({ type: 'observation' as const, data: o, date: new Date(o.timestamp) })),
    ...interventions.map(i => ({ type: 'intervention' as const, data: i, date: new Date(i.timestamp) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first

  const handleCreateIntervention = (e: FormEvent) => {
    e.preventDefault();
    if (!interventionAction.trim()) return;

    const newInt: Intervention = {
      id: `int-${Date.now()}`,
      fieldId: field.id,
      observationId: selectedObsForIntervention,
      timestamp: new Date().toISOString(),
      action: interventionAction.trim(),
      notes: interventionNotes.trim(),
      isDemo: false,
    };

    onAddIntervention(newInt);
    setInterventionAction('');
    setInterventionNotes('');
    setIsInterventionModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto px-4">
      {/* Header */}
      <div className="pt-2 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#0C2518]">
              {t.passportTitle}
            </h1>
          </div>
          <p className="text-xs text-[#6D4C41] mt-0.5">
            {t.passportSubtitle}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] shrink-0">
          FOR DEMO PURPOSES ONLY
        </span>
      </div>

      {/* Field Passport Summary Card */}
      <div className="rounded-2xl bg-white border border-[#EAE4D5] p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#6D4C41] uppercase">{t.fieldId}</span>
            <span className="px-2 py-0.5 rounded-md bg-[#0C2518] text-[#81C784] font-mono text-xs font-bold">
              {field.id}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
            {t.monitoring}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
          <div>
            <div className="text-[10px] text-[#6D4C41] uppercase">{t.crop}</div>
            <div className="font-semibold text-sm text-[#0C2518]">{field.crop}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#6D4C41] uppercase">{t.area}</div>
            <div className="font-semibold text-sm text-[#0C2518]">{field.area}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#6D4C41] uppercase">{t.location}</div>
            <div className="font-medium text-xs text-[#2D1E16] truncate">
              {field.location === 'Location not set' ? t.locationNotSet : field.location}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#6D4C41] uppercase">{t.lastScan}</div>
            <div className="font-semibold text-xs text-[#0C2518]">
              {lastScanDisplay}
            </div>
          </div>
        </div>

        {/* Quick Action to Add Manual Intervention */}
        <div className="mt-3 pt-3 border-t border-[#F0ECE1]">
          <button
            onClick={() => {
              setSelectedObsForIntervention(undefined);
              setIsInterventionModalOpen(true);
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#F5F2EA] hover:bg-[#EAE4D5] text-[#123824] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>{t.recordAction}</span>
          </button>
        </div>
      </div>

      {/* Timeline Section Title */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-bold tracking-wide uppercase text-[#0C2518]">
          {t.timelineTitle}
        </h2>
        <span className="text-xs font-mono text-[#6D4C41]">
          {timelineItems.length} Events ({observations.length} obs · {interventions.length} action · 1 sowing)
        </span>
      </div>

      {/* Empty State */}
      {timelineItems.length === 0 && (
        <div className="rounded-2xl bg-white border border-dashed border-[#DED5C0] p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F5F2EA] text-[#6D4C41] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0C2518]">{t.noObservations}</h3>
            <p className="text-xs text-[#6D4C41] mt-1">{t.noObservationsPrompt}</p>
          </div>
          <button
            onClick={onNavigateToScan}
            className="px-4 py-2 rounded-xl bg-[#0C2518] text-white font-bold text-xs shadow-md"
          >
            {t.scanFieldCTA}
          </button>
        </div>
      )}

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-4 border-l-2 border-[#DED5C0] ml-3">
        {timelineItems.map((item) => {
          if (item.type === 'sowing') {
            return (
              <div key="sowing-event" className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#8D6E63] border-2 border-white shadow-xs" />

                <div className="rounded-xl bg-white border border-[#EAE4D5] p-3 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#6D4C41]">
                    <span className="font-semibold uppercase tracking-wider">
                      {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold">
                      {t.demoBadge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0C2518] mt-1">
                    Sowing Recorded · Paddy Variety MTU-1010
                  </h4>
                  <p className="text-[11px] text-[#6D4C41] mt-0.5">
                    Field established. Digital Field Passport initiated.
                  </p>
                </div>
              </div>
            );
          }

          if (item.type === 'intervention') {
            const int = item.data;
            return (
              <div key={int.id} className="relative group">
                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#2E7D32] border-2 border-white shadow-xs flex items-center justify-center text-white">
                  <FileCheck className="w-2.5 h-2.5" />
                </span>

                <div className="rounded-xl bg-[#F4F9F5] border border-[#C8E6C9] p-3 shadow-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#2E7D32] uppercase tracking-wider">
                      {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {t.recordAction}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {int.isDemo && (
                        <span className="px-1.5 py-0.5 rounded bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold">
                          {t.demoBadge}
                        </span>
                      )}
                      {/* Delete button */}
                      <button
                        onClick={() => onDeleteIntervention(int.id)}
                        className="p-1 rounded-md text-[#8D6E63] hover:text-[#C62828] hover:bg-white transition-colors"
                        title="Delete Intervention"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-[#0C2518] mt-1">
                    {int.action}
                  </h4>
                  {int.notes && (
                    <p className="text-[11px] text-[#2D4536] mt-1 leading-snug">
                      {int.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Observation Item
          const obs = item.data;
          const isExpanded = expandedObsId === obs.id;

          return (
            <div key={obs.id} className="relative group">
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0C2518] border-2 border-white shadow-xs" />

              <div className="rounded-2xl bg-white border border-[#EAE4D5] p-3.5 shadow-sm space-y-2.5">
                {/* Header Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0C2518]">
                      {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {obs.isDemo ? (
                      <span className="px-1.5 py-0.2 rounded bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold">
                        {t.demoBadge}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-bold">
                        VERIFIED SCAN
                      </span>
                    )}
                  </div>

                  {/* Recorded Status Badge */}
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-[10px] text-[#2E7D32] font-semibold bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                      <Check className="w-2.5 h-2.5" />
                      <span>Recorded</span>
                    </span>

                    <button
                      onClick={() => setDeletingObsId(obs.id)}
                      className="p-1 rounded-md text-[#8D6E63] hover:text-[#C62828] hover:bg-[#F5F2EA] transition-colors"
                      title="More / Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content preview */}
                <div className="flex items-start gap-3">
                  <img
                    src={obs.photoUrl}
                    alt={obs.condition}
                    className="w-14 h-14 rounded-xl object-cover border border-[#DED5C0] shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#0C2518] truncate">
                      {obs.condition}
                    </h4>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#6D4C41]">
                      <span>
                        {t.severityLabel}: <strong className="text-[#0C2518]">{obs.severity}%</strong>
                      </span>
                      <span>
                        {t.confidenceLabel}: <strong className="text-[#2E7D32]">{obs.confidence}%</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#8D6E63] mt-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{obs.location}</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Accordion for full agronomic guidance */}
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedObsId(isExpanded ? null : obs.id)}
                    className="w-full flex items-center justify-between py-1 text-[11px] font-semibold text-[#2E7D32] hover:underline"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Observations & Action'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-[#F0ECE1] space-y-2 text-xs">
                      {obs.observations && obs.observations.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-[#6D4C41] uppercase">
                            {t.whatKshetraObserved}
                          </div>
                          <ul className="mt-1 space-y-1 text-[#2D1E16]">
                            {obs.observations.map((o, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11px]">
                                <span className="w-1 h-1 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                                <span>{o}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {obs.guidance && obs.guidance.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-[#6D4C41] uppercase">
                            {t.whatToDoNext}
                          </div>
                          <ul className="mt-1 space-y-1 text-[#2D1E16]">
                            {obs.guidance.map((g, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11px]">
                                <span className="w-1 h-1 rounded-full bg-[#81C784] mt-1.5 shrink-0" />
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Button to quickly record an intervention on this specific observation */}
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setSelectedObsForIntervention(obs.id);
                            setIsInterventionModalOpen(true);
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.recordAction} for this scan</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECORD INTERVENTION MODAL */}
      {isInterventionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-4 border border-[#DED5C0] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
              <h3 className="text-sm font-bold text-[#0C2518]">
                {t.recordInterventionTitle}
              </h3>
              <button
                onClick={() => setIsInterventionModalOpen(false)}
                className="p-1 rounded-md text-[#6D4C41] hover:bg-[#F5F2EA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6D4C41] uppercase mb-1">
                  {t.interventionActionPrompt}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Applied organic neem oil spray; drained excess water"
                  value={interventionAction}
                  onChange={(e) => setInterventionAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DED5C0] text-xs focus:ring-2 focus:ring-[#2E7D32] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6D4C41] uppercase mb-1">
                  {t.interventionNotesPrompt}
                </label>
                <textarea
                  rows={2}
                  placeholder="Weather conditions, dosage rules adhered to, re-inspection notes..."
                  value={interventionNotes}
                  onChange={(e) => setInterventionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DED5C0] text-xs focus:ring-2 focus:ring-[#2E7D32] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInterventionModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#DED5C0] text-xs font-semibold text-[#6D4C41] hover:bg-[#F5F2EA]"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold shadow-sm"
                >
                  {t.saveInterventionBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DELETING OBSERVATION */}
      {deletingObsId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl space-y-3 border border-[#DED5C0] text-center">
            <div className="w-10 h-10 rounded-full bg-[#FFEBEE] text-[#C62828] flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-[#0C2518]">
              {t.deleteObservationTitle}
            </h3>

            <p className="text-xs text-[#6D4C41]">
              {t.deleteObservationDesc}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingObsId(null)}
                className="flex-1 py-2 rounded-xl border border-[#DED5C0] text-xs font-semibold text-[#6D4C41] hover:bg-[#F5F2EA]"
              >
                {t.cancelBtn}
              </button>

              <button
                onClick={() => {
                  onDeleteObservation(deletingObsId);
                  setDeletingObsId(null);
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
