export type Language = 'en' | 'hi' | 'te';

export interface Field {
  id: string;
  name: string;
  crop: string;
  area: string;
  location: string; // "Location not set" or user captured location or "Demo field"
  coordinates?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  status: 'Monitoring' | 'Action Required' | 'Recovering' | 'Optimal';
  createdAt: string;
  isDemo?: boolean;
}

export interface Observation {
  id: string;
  fieldId: string;
  timestamp: string;
  photoUrl: string;
  crop: string;
  condition: string;
  severity: number; // 0 to 100
  confidence: number; // 0 to 100
  observations: string[];
  guidance: string[];
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  sensorContext?: {
    deviceMotion?: string;
    orientation?: string;
    luxLevel?: string;
    stability?: string;
  };
  source: 'camera' | 'gallery' | 'demo';
  integrityStatus: 'none' | 'sealed' | 'tampered' | 'recorded';
  hash?: string;
  isDemo?: boolean;
}

export interface Intervention {
  id: string;
  fieldId: string;
  observationId?: string;
  timestamp: string;
  action: string;
  notes: string;
  isDemo?: boolean;
}

export interface EvidencePackage {
  id: string;
  fieldId: string;
  createdAt: string;
  title: string;
  photos: string[];
  metadata: {
    location: string;
    coordinates?: {
      lat: number;
      lng: number;
      accuracy?: number;
    };
    capturedAt: string;
    sensorContext: {
      deviceMotion: string;
      orientation: string;
      stability: string;
      hardwareProvider: string;
    };
    deviceContext: string;
  };
  assessment: {
    crop: string;
    condition: string;
    severity: number;
    confidence: number;
    observations: string[];
  };
  originalPayload: string;
  currentPayload: string;
  originalHash: string;
  currentHash: string;
  verificationStatus: 'verified' | 'mismatch';
  syncStatus: 'stored_local' | 'sync_pending';
  isTampered?: boolean;
  tamperLog?: string;
  isDemo?: boolean;
}

export interface HardwarePermissions {
  camera: 'granted' | 'denied' | 'prompt' | 'unsupported';
  location: 'granted' | 'denied' | 'prompt' | 'unsupported';
  motion: 'granted' | 'denied' | 'prompt' | 'unsupported';
}
