# Kshetra — The Field That Remembers

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Web Crypto](https://img.shields.io/badge/Integrity-SHA--256-emerald.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

> **Tagline:** Understand. Act. Remember. Verify.  
> **Core Differentiator:** Evidence Continuity — An offline-first field intelligence system that remembers what the field looked like before, what changed, what was detected, what action was taken, what happened afterward, and cryptographically seals verifiable proof.

---

## 🌾 The Fundamental Problem

A standard agricultural AI application is stateless and disconnected:
> *"Your crop has a disease."*

This fails farmers and insurers alike because it lacks context, progression, and accountability.

**Kshetra** introduces **Evidence Continuity**:
```
┌──────────┐     ┌───────────┐     ┌─────────┐     ┌───────────┐
│   SCAN   │ ──► │  ANALYZE  │ ──► │   ACT   │ ──► │   TRACK   │
└──────────┘     └───────────┘     └─────────┘     └───────────┘
                                                         │
┌──────────┐     ┌───────────┐     ┌─────────┐           ▼
│  VERIFY  │ ◄── │   SIGN    │ ◄── │  SEAL   │ ◄── ┌───────────┐
└──────────┘     └───────────┘     └─────────┘     │ REMEMBER  │
                                                   └───────────┘
```

1. **What the field looked like before** (Healthy vegetative baseline, tillering, growth cycle).
2. **What changed** (Early leaf curl symptoms, fungal spotting, severe lodging).
3. **What was detected** (Multi-condition agronomic assessment with confidence and severity gauge).
4. **What action was taken** (Targeted intervention logging, organic neem sprays, drainage adjustment).
5. **What happened afterward** (Recovery tracking and leaf flattening over chronological intervals).
6. **Verifiable proof** (Cryptographically sealed evidence packages protecting against post-event tampering).

---

## 🏛️ The Three Pillars

### 1. UNDERSTAND (Crop-Health Intelligence)
- Multi-condition foliar diagnosis (Paddy Leaf Curl, Blast Lesions, Storm Lodging, Optimal Healthy Baseline).
- Severity percentage bar gauge & confidence score.
- **Controlled Agronomic Knowledge Base**: Structured, actionable next steps in English, Hindi, and Telugu. *Strict rule: Prevents uncontrolled chemical overdoses or unsafe pesticide recommendations.*

### 2. MANAGE (Digital Field Passport)
- **Living Field Ledger**: Chronological vertical timeline tracking Field `KR-1042` from sowing to recovery.
- Observation records with photo thumbnails, capture timestamps, and hardware sensor stability context.
- Intervention logging linking actions directly to specific observations.
- **Full Deletion Lifecycle**: Every user-created record has a delete action guarded by safety confirmation modals.

### 3. VERIFY (Evidence Mode & Integrity Protection)
- **High-Contrast Security Styling**: Dedicated Evidence Mode for important, claim-critical agricultural events.
- Multi-angle photographic capture (Angles 1, 2, 3) with real GPS context and device motion telemetry.
- **Web Crypto SHA-256 Digest**: Canonical JSON serialization hashed using browser `crypto.subtle.digest('SHA-256')`.
- **Interactive Tamper Demonstration (Hackathon Hero Demo)**:
  - *Simulate Tamper*: Subtly alters the payload data after sealing.
  - *Verify Integrity*: Detects checksum mismatch and triggers `✗ HASH MISMATCH`.
  - *Restore Original*: Restores the canonical payload and confirms `✓ INTEGRITY VERIFIED`.

---

## 🌐 3D Digital Twin & Advanced Visual Graphics

Kshetra incorporates interactive Three.js WebGL graphics and spatial agricultural telemetry:

### 1. Interactive 3D Cadastral Digital Twin (`Cadastral3DViewer`)
- **Procedural 3D Parcel Mesh**: Realistic elevation contours and terraced agricultural bunds for Field `KR-1042`.
- **Multispectral Shaders**:
  - `NDVI`: Thermal chlorophyll canopy gradient (vibrant emerald `>0.8`, amber moderate, and red stress hotspots).
  - `Satellite`: High-definition photorealistic terraced field textures.
  - `Contours`: Topographical elevation wireframes.
- **Survey Pegs & Laser Perimeter**: 3D corner survey pillars connected by glowing laser boundary lines.
- **Centroid Beacon**: Real-time rotating holographic diamond with expanding sonar pulse rings.
- **Drone Flyover Orbit**: Automated cinematic 360° orbital camera with touch/mouse drag controls, pitch altitude adjustment, and floating atmospheric dust particles.

### 2. 3D Holographic Crop Specimen Scanner (`Crop3DScanner`)
- **Sculpted 3D Specimen Blade**: Curving monocot leaf geometry with central midrib and parallel monocot leaf veins.
- **Laser Scan Plane**: Oscillating 3D laser slicing plane with glowing grid matrix and variable opacity.
- **Spatial Lesion Hotspots**: Interactive 3D symptom beacons positioned directly on the leaf blade (Primary Blast lesion, appressorium attachment site).
- **Spectral Absorption HUD**: Real-time chlorophyll absorbance gauges (450nm & 660nm) and epicuticular integrity telemetry.
- **Inspection Modes**: Switch between `3D Visual`, `Thermal IR`, and `Matrix` cellular stress wireframe.

### 3. 3D Cryptographic Evidence Vault Monolith (`Cryptographic3DBlock`)
- **Translucent Crystal Monolith**: WebGL glass-like cube representing the sealed cryptographic evidence package.
- **Dynamic State Reaction**:
  - *Verified State*: Emerald crystal lattice (`#00E676`), orbiting harmonic particle rings, and pristine crystal edges.
  - *Tampered State*: Shifts to crimson alert pulses (`#FF1744`), with jagged geometric fracture cracks appearing across the facets and erratic spark particles!
  - *Restorative Wave*: Triggering "Restore Block" clears internal fractures with a sweeping emerald wave.
- **Orbit Inspection**: 360° touch/mouse rotation to inspect every facet of the cryptographic seal.

---

## 🔒 Technical Honesty & System Boundaries

| Capability | Current Browser Prototype (POC) | Native Android Target Roadmap |
| :--- | :--- | :--- |
| **Integrity Proof** | Real Web Crypto API `crypto.subtle.digest('SHA-256')` | Android Keystore Hardware-Backed Private Key Signing |
| **Vision AI** | Deterministic agronomic rule-engine (`POC DEMO ANALYSIS`) | Jetpack CameraX + LiteRT on-device inference runtime |
| **Guidance Generation** | Structured agronomy rulebase in EN / HI / TE | On-device local LLM (Gemma 3n / LiteRT-LM) |
| **Location & GPS** | HTML5 Geolocation API with accuracy meter (Default: "Location not set") | Google Play Fused Location Provider |
| **Local Persistence** | Browser LocalStorage & IndexedDB with JSON serialization | Room Database with SQLiteCipher encryption |
| **Offline Sync** | Service Worker PWA cache with manual simulation toggle | WorkManager background sync queue |

> [!IMPORTANT]
> **Zero Fabricated Locations or Claims**:  
> Kshetra never uses hardcoded geographic locations (no fake Nalgonda, Telangana, Kadapa, Hyderabad coordinates). Default location is `"Location not set"`. Real coordinates and accuracy are captured upon user permission. Demo data is explicitly tagged `DEMO` with location set to `"Demo field"`.

---

## 📱 Mobile-First Experience

Kshetra was designed mobile-first for **360px, 390px, 412px, and 430px** viewports:
- **Thumb-Friendly Bottom Navigation**: Home, Scan (elevated shutter button), Passport, Evidence, and More.
- **PWA Ready**: Installable as a standalone app with offline shell caching (`manifest.webmanifest` + `sw.js`).
- **Real Device Hardware**: Uses `getUserMedia` for camera capture, Geolocation API for GPS, and DeviceMotion API for device steadiness telemetry.

---

## 🏢 Kshetra Office (Stakeholder Portal)

Switchable in the header to view the stakeholder side:
- Field overview and status of `KR-1042`.
- Checksum audit table showing sealed evidence packages, original SHA-256 hashes, and hardware context.
- Complete activity log of every observation and intervention.
- Zero fake operational statistics (no fabricated farmer counts or pending claim metrics).

---

## 🚀 Quick Start & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (v9 or higher)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/pavankarthikeyaatchyuta-lab/Kshetra.git
cd Kshetra

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173/`.

### Production Build & Preview

```bash
npm run build
npm run preview
```

---

## ⏱️ 90-Second Judge Walkthrough

For the exact step-by-step hackathon judging flow, please review:
👉 **[DEMO_GUIDE.md](./DEMO_GUIDE.md)**

---

## 📂 Project Structure

```
Kshetra/
├── public/
│   ├── favicon.svg             # Kshetra sacred leaf + furrow emblem
│   ├── manifest.webmanifest    # PWA install manifest
│   ├── sw.js                   # Offline caching service worker
│   ├── sample-healthy.svg      # Sample healthy leaf asset
│   ├── sample-leafcurl.svg     # Sample leaf curl symptom asset
│   └── sample-storm.svg        # Sample storm damage lodging asset
├── src/
│   ├── components/
│   │   ├── navigation/         # Header & thumb-friendly BottomNav
│   │   ├── splash/             # 1.2s animated splash screen
│   │   └── ui/                 # KshetraLogo and brand badges
│   ├── models/
│   │   └── types.ts            # Domain types (Field, Observation, EvidencePackage)
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Active field KR-1042 & Field Story preview
│   │   ├── ScanScreen.tsx      # Camera viewfinder, 5-stage analysis & results
│   │   ├── PassportScreen.tsx  # Digital Field Passport & chronological timeline
│   │   ├── EvidenceScreen.tsx  # Evidence Mode, SHA-256 & tamper detection
│   │   ├── OfficeScreen.tsx    # Stakeholder audit portal
│   │   └── MoreScreen.tsx      # Permissions dashboard, language & reset
│   ├── services/
│   │   ├── crypto.ts           # Canonical JSON & Web Crypto SHA-256
│   │   ├── hardware.ts         # Geolocation & device sensors
│   │   ├── i18n.ts             # Translations (EN, HI, TE) & agronomy knowledge
│   │   └── storage.ts          # Local persistence & demo datasets
│   ├── App.tsx                 # Root application shell
│   ├── index.css               # Tailwind CSS v4 styling & color palette
│   └── main.tsx                # React root & Service Worker registration
├── DEMO_GUIDE.md               # 90-Second Hackathon Judge Walkthrough
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🌐 Multilingual Support

Kshetra provides native multilingual experiences across UI, diagnostic observations, and actionable agronomic guidance:
- **English** (`en`)
- **हिन्दी** (`hi`)
- **తెలుగు** (`te`)

---

## ⚖️ License
MIT License. Built for agricultural resilience, transparency, and verifiable field evidence.
