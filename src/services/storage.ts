import type { Field, Observation, Intervention, EvidencePackage } from '../models/types';
import { canonicalJsonStringify, computeSha256Hex } from './crypto';

const STORAGE_KEYS = {
  FIELD: 'kshetra_field_v2',
  OBSERVATIONS: 'kshetra_observations_v2',
  INTERVENTIONS: 'kshetra_interventions_v2',
  EVIDENCE: 'kshetra_evidence_v2',
  LOCATION_SETTING: 'kshetra_location_setting_v2',
  OFFLINE_SIMULATED: 'kshetra_simulated_offline_v2',
  LANGUAGE: 'kshetra_selected_lang_v2',
};

// Seed demo field KR-1042 without fabricated geographic coordinates
export const INITIAL_FIELD: Field = {
  id: 'KR-1042',
  name: 'North Terrace Block',
  crop: 'Paddy',
  area: '5.2 acres',
  location: 'Demo field',
  status: 'Monitoring',
  createdAt: '2026-06-12T07:30:00Z',
  isDemo: true,
};

// Seed demo timeline observations - explicitly labelled as DEMO
export const INITIAL_OBSERVATIONS: Observation[] = [
  {
    id: 'obs-demo-1',
    fieldId: 'KR-1042',
    timestamp: '2026-06-18T09:15:00Z',
    photoUrl: '/sample-healthy.svg',
    crop: 'Paddy',
    condition: 'Healthy Baseline — Optimal Vegetative',
    severity: 6,
    confidence: 94,
    observations: [
      'Uniform green canopy throughout active tillering.',
      'No foliar spotting or insect punctures detected.',
      'Optimal leaf transpiration and leaf collar integrity.',
    ],
    guidance: [
      'Maintain standard scheduled baseline irrigation.',
      'Proceed with scheduled fertilizer schedule.',
    ],
    location: 'Demo field',
    source: 'demo',
    integrityStatus: 'sealed',
    hash: '6a8e412f8d394b00a5d4301c902ffcb67e3a992e5912448ca3318f72c0199d7a',
    isDemo: true,
  },
  {
    id: 'obs-demo-2',
    fieldId: 'KR-1042',
    timestamp: '2026-07-12T11:40:00Z',
    photoUrl: '/sample-leafcurl.svg',
    crop: 'Paddy',
    condition: 'Leaf Curl — Moderate Early Stage',
    severity: 38,
    confidence: 91,
    observations: [
      'Foliar curling observed on middle canopy foliage.',
      'Localized chlorotic margins on leaf tips.',
      'Stem node integrity intact; no sheath necrosis.',
    ],
    guidance: [
      'Inspect 5m surrounding perimeter for vector activity.',
      'Apply neem-based organic emulsion to protect fresh tillers.',
      'Record intervention in Field Passport.',
    ],
    location: 'Demo field',
    source: 'demo',
    integrityStatus: 'sealed',
    hash: '4b79c3f19e7a20c3a8e945511b0e334a17df98cb288102941ec59aa71e98d912',
    isDemo: true,
  },
  {
    id: 'obs-demo-3',
    fieldId: 'KR-1042',
    timestamp: '2026-07-28T08:20:00Z',
    photoUrl: '/sample-healthy.svg',
    crop: 'Paddy',
    condition: 'Recovery Progress — Leaf Flattening',
    severity: 6,
    confidence: 95,
    observations: [
      'Fresh upper canopy growth showing smooth leaf unfurling.',
      'Chlorotic discoloration resolved on 88% of tagged plants.',
      'Tillering density stabilized.',
    ],
    guidance: [
      'Return to scheduled maintenance monitoring.',
      'Next passport scan recommended in 7 days.',
    ],
    location: 'Demo field',
    source: 'demo',
    integrityStatus: 'sealed',
    hash: '93e11a2f64c8d50b4c7811902ae45db9c011945f8e67a9143890bbce88147d33',
    isDemo: true,
  },
  {
    id: 'obs-demo-4',
    fieldId: 'KR-1042',
    timestamp: '2026-09-02T16:10:00Z',
    photoUrl: '/sample-storm.svg',
    crop: 'Paddy',
    condition: 'Lodging Damage — Severe Weather Event',
    severity: 81,
    confidence: 97,
    observations: [
      'Substantial physical lodging observed across western quadrant.',
      'Bent stem bases with standing rainwater ponding.',
      'Grain panicles submerged at soil-water boundary.',
    ],
    guidance: [
      'Immediate field drainage required to prevent premature sprouting.',
      'Generate sealed Evidence Package for crop loss documentation.',
    ],
    location: 'Demo field',
    source: 'demo',
    integrityStatus: 'sealed',
    hash: 'e82b79a1f9450c2311894a73ef59da201884bbec4210984cfb92e7aa3418ef09',
    isDemo: true,
  },
];

export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-demo-1',
    fieldId: 'KR-1042',
    observationId: 'obs-demo-2',
    timestamp: '2026-07-16T08:00:00Z',
    action: 'Targeted organic neem bio-spray & water drainage adjustment',
    notes: 'Applied at dawn. Nitrogen top-dressing suspended for 6 days.',
    isDemo: true,
  },
];

export async function createInitialEvidencePackage(): Promise<EvidencePackage> {
  const payloadObj = {
    fieldId: 'KR-1042',
    crop: 'Paddy',
    condition: 'Lodging Damage — Severe Weather Event',
    severity: 81,
    capturedAt: '2026-09-02T16:10:00Z',
    location: 'Demo field',
    photosCount: 2,
    sensorContext: {
      stability: 'Device in Hand',
      motionDetected: true,
      hardwareProvider: 'Browser DeviceMotion API',
    },
  };

  const canonical = canonicalJsonStringify(payloadObj);
  const hash = await computeSha256Hex(canonical);

  return {
    id: 'ev-demo-1',
    fieldId: 'KR-1042',
    createdAt: '2026-09-02T16:25:00Z',
    title: 'Severe Storm Lodging Documentation',
    photos: ['/sample-storm.svg', '/sample-storm.svg'],
    metadata: {
      location: 'Demo field',
      capturedAt: '2026-09-02T16:10:00Z',
      sensorContext: {
        deviceMotion: 'Detected',
        orientation: 'Portrait',
        stability: 'Device in Hand',
        hardwareProvider: 'Browser DeviceMotion API',
      },
      deviceContext: 'Mobile Web Browser / CameraX Candidate',
    },
    assessment: {
      crop: 'Paddy',
      condition: 'Lodging Damage — Severe Weather Event',
      severity: 81,
      confidence: 97,
      observations: [
        'Physical stem lodging in western quadrant.',
        'Standing rainwater ponding over panicles.',
      ],
    },
    originalPayload: canonical,
    currentPayload: canonical,
    originalHash: hash,
    currentHash: hash,
    verificationStatus: 'verified',
    syncStatus: 'stored_local',
    isTampered: false,
    isDemo: true,
  };
}

// Storage helpers
export function getSavedField(): Field {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FIELD);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_FIELD;
}

export function saveField(field: Field): void {
  localStorage.setItem(STORAGE_KEYS.FIELD, JSON.stringify(field));
}

export function getSavedObservations(): Observation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_OBSERVATIONS;
}

export function saveObservations(obs: Observation[]): void {
  localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(obs));
}

export function addObservation(obs: Observation): Observation[] {
  const current = getSavedObservations();
  const updated = [obs, ...current];
  saveObservations(updated);
  return updated;
}

export function deleteObservation(id: string): Observation[] {
  const current = getSavedObservations();
  const updated = current.filter(o => o.id !== id);
  saveObservations(updated);
  return updated;
}

export function getSavedInterventions(): Intervention[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERVENTIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_INTERVENTIONS;
}

export function saveInterventions(interventions: Intervention[]): void {
  localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(interventions));
}

export function addIntervention(intervention: Intervention): Intervention[] {
  const current = getSavedInterventions();
  const updated = [intervention, ...current];
  saveInterventions(updated);
  return updated;
}

export function deleteIntervention(id: string): Intervention[] {
  const current = getSavedInterventions();
  const updated = current.filter(i => i.id !== id);
  saveInterventions(updated);
  return updated;
}

export async function getSavedEvidencePackages(): Promise<EvidencePackage[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  const initial = await createInitialEvidencePackage();
  return [initial];
}

export function saveEvidencePackages(packages: EvidencePackage[]): void {
  localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(packages));
}

export function deleteEvidencePackage(id: string): EvidencePackage[] {
  const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
  const current: EvidencePackage[] = raw ? JSON.parse(raw) : [];
  const updated = current.filter(p => p.id !== id);
  saveEvidencePackages(updated);
  return updated;
}

export function clearDemoDataAndReset(): void {
  localStorage.removeItem(STORAGE_KEYS.FIELD);
  localStorage.removeItem(STORAGE_KEYS.OBSERVATIONS);
  localStorage.removeItem(STORAGE_KEYS.INTERVENTIONS);
  localStorage.removeItem(STORAGE_KEYS.EVIDENCE);
  localStorage.removeItem(STORAGE_KEYS.LOCATION_SETTING);
}
