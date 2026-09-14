# Kshetra — 90-Second Hackathon Judge Demo Guide

> **Tagline**: Understand. Act. Remember. Verify.  
> **Core Differentiator**: *Evidence Continuity* — Not just crop disease detection, but an offline-first system that remembers what changed, what was done, and cryptographically verifies proof.

---

## ⏱️ Step-by-Step 90-Second Walkthrough

```
[00:00 - 00:15] Splash Screen & Evidence Continuity Positioning
[00:15 - 00:30] Real Location & Active Field Passport Summary
[00:30 - 00:50] Field Scanner & On-Device Analysis Simulation
[00:50 - 01:10] Digital Field Passport & Deletion Lifecycle
[01:10 - 01:25] Evidence Mode & Web Crypto SHA-256 Tamper Detection
[01:25 - 01:30] Stakeholder Office Portal & Native Roadmap
```

---

### Step 1: Splash Screen & Evidence Continuity (0:00 - 0:15)
1. **Launch App**: Observe the deep forest green splash screen with the Kshetra logo, wordmark, tagline ("THE FIELD THAT REMEMBERS"), and status transition: `"Preparing field intelligence..."`.
2. **Key Talking Point**: 
   > *"Existing agricultural apps simply say 'your crop has a disease'. Kshetra remembers what the field looked like before, what changed, what was detected, what action was taken, and creates verifiable evidence packages."*

---

### Step 2: Honest Location & Active Field KR-1042 (0:15 - 0:30)
1. **Look at Active Field Card**: Note that location defaults to `"Location not set"` or `"Demo field"` with an explicit `DEMO` badge.
2. **Tap "Use my location"**: 
   - Browser requests real device GPS.
   - Shows real coordinates and meter accuracy: `e.g. 17.3850° N, 78.4867° E (±12m)`.
   - Never fabricates fake coordinates.
3. **Toggle Language**: Switch quickly between **EN**, **हिन्दी**, and **తెలుగు** in the header. Show that observations and actionable steps adapt seamlessly.

---

### Step 3: Field Scan & Structured Analysis (0:30 - 0:50)
1. **Tap the Center "Scan" Hero Button**:
   - The live camera viewfinder automatically starts on entry with active reticle framing and live metadata (`GPS`, `Motion Stability`, `Parcel KR-1042`).
   - Notice the transparent distinction between **Live Camera Capture** and **Demo Presets**:
     - *Live Camera*: Tap the shutter button — immediately captures the active video frame (`PHOTO CAPTURED`) and dynamically computes canvas RGB/chlorophyll indices.
     - *Demo Presets*: Tap **"Leaf Curl"**, **"Storm Lodging"**, or **"Healthy Leaf"** — explicitly marked as `DEMO SPECIMEN SELECTED` with benchmark data.
2. **Tap "Analyze"**:
   - Watch the 5-stage sequential milestone analysis:
     1. *Reading image ✓*
     2. *Identifying crop ✓*
     3. *Assessing visible condition ✓*
     4. *Estimating severity ✓*
     5. *Preparing structured agronomy guidance ✓*
   - Note the honest label: `POC DEMO ANALYSIS` (explaining the target native stack: CameraX → LiteRT → Gemma 3n).
3. **Review Result Screen**:
   - Condition: *Leaf Curl — Moderate* | Severity: *38%* | Confidence: *91%*.
   - **What Kshetra Observed**: 3 concise foliar observations.
   - **What to Do Next**: Safe, controlled agronomic rules (no dangerous uncontrolled chemical prescriptions).
   - Tap **"Add to Passport"**.

---

### Step 4: Digital Field Passport & Delete Lifecycle (0:50 - 1:10)
1. **Navigate to "Passport"**:
   - Review the vertical chronological timeline:
     - *2 SEP — Storm damage 81% (DEMO)*
     - *28 JUL — Recovery 6% (DEMO)*
     - *16 JUL — Intervention recorded (DEMO)*
     - *12 JUL — Disease observed 38% (DEMO)*
     - *18 JUN — Healthy baseline 94% (DEMO)*
     - *12 JUN — Sowing recorded (DEMO)*
     - *+ Your newly added scan!*
   - Observe the unified count: `6 Events (4 obs · 1 action · 1 sowing)`.
   - Note that Field Health is dynamically derived: with the 2 Sep lodging damage (81% severity), health is accurately shown as `19% (Significant Damage Detected)`.
2. **Record Intervention**:
   - Tap **"Record Action"**, enter e.g. `"Organic neem spray applied"`, and save.
   - Observe it instantly appended into the living field story.
3. **Demonstrate Record Deletion**:
   - Tap the trash icon on any record.
   - Observe the safety confirmation modal: *"Delete this observation? Deleting this record removes it from this prototype's local field history."*
   - Tap **"Delete"** — record is safely removed, and field health recalculates dynamically in real time.

---

### Step 5: Evidence Mode & SHA-256 Tamper Detection (1:10 - 1:25)
1. **Tap "Evidence" Tab**:
   - Notice the high-contrast security styling (`EVIDENCE MODE - Important Event`).
   - Explains: `Browser Cryptographic Integrity Demonstration (Web Crypto API)`.
   - Inspect the sealed package with multi-angle photos, GPS context, and device sensor state.
2. **Inspect Hash UI**:
   - Shows **Original Hash** vs **Current Hash** with full real 64-character SHA-256 hexadecimal digests.
   - Current status: `✓ INTEGRITY VERIFIED` with confetti celebration.
3. **Tamper Demonstration (The Hackathon Hero Demo)**:
   - Tap **"Simulate Tamper"**: subtly alters the payload data after sealing.
   - Tap **"Verify Integrity"**:
     - Result immediately triggers: `✗ HASH MISMATCH`.
     - Displays tamper alert: *"Evidence changed after sealing. SHA-256 hash does not match original sealed record."*
   - Tap **"Restore Original"** → re-verifies → `✓ INTEGRITY VERIFIED`.

---

### Step 6: Kshetra Office & Offline-First Operation (1:25 - 1:30)
1. **Tap Header "Office" Icon**:
   - Switches to **Kshetra Office** (stakeholder view for agronomists, insurers, and field managers).
   - Shows Field KR-1042 audit trail, sealed packages ledger, and checksum audit table.
   - Zero fake claims: explicitly marked `DEMO DATASET`.
2. **Test Offline-First Mode**:
   - Under **More**, tap **"Simulate Offline Mode"**.
   - Header switches to `OFFLINE · Stored on device · Sync pending`.
   - Every feature (Camera, Passport, Evidence sealing, Storage) works completely offline.
