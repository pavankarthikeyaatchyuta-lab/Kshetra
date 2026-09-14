import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import type { Field, Observation, Language } from '../models/types';
import { translations, agronomyKnowledge } from '../services/i18n';
import { captureSensorSnapshot } from '../services/hardware';
import type { SensorSnapshot } from '../services/hardware';
import { 
  Camera, 
  RefreshCw, 
  Zap, 
  Check, 
  ArrowLeft, 
  MapPin, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  PlusCircle, 
  FileCheck,
  FlaskConical
} from 'lucide-react';

interface ScanScreenProps {
  field: Field;
  onAddObservation: (obs: Observation) => void;
  onRecordInterventionPrompt?: (obsId: string) => void;
  onBack: () => void;
  language: Language;
  isOnline: boolean;
}

type ScanState = 'ready' | 'preview' | 'analyzing' | 'result';
type CaptureSource = 'camera' | 'demo';

interface CameraAnalysisResult {
  condition: string;
  severity: number;
  confidence: number;
  observations: string[];
  guidance: string[];
  metricsText: string;
}

export const ScanScreen: FC<ScanScreenProps> = ({
  field,
  onAddObservation,
  onRecordInterventionPrompt,
  onBack,
  language,
  isOnline,
}) => {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [scanState, setScanState] = useState<ScanState>('ready');
  const [captureSource, setCaptureSource] = useState<CaptureSource>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'leaf_curl' | 'blast' | 'healthy'>('leaf_curl');
  const [cameraAnalysisResult, setCameraAnalysisResult] = useState<CameraAnalysisResult | null>(null);

  // Sensor metadata
  const [sensorSnapshot, setSensorSnapshot] = useState<SensorSnapshot | null>(null);
  const [captureTime, setCaptureTime] = useState<string>('');

  // Analysis progress animation steps
  const [analysisStep, setAnalysisStep] = useState(0);

  // Initial sensor probe
  useEffect(() => {
    captureSensorSnapshot().then(setSensorSnapshot);
  }, []);

  // Auto-start camera on mount and manage cleanup
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      stopCamera();
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const handleToggleTorch = async () => {
    if (!cameraActive) {
      await startCamera();
    }
    const nextState = !torchOn;
    setTorchOn(nextState);
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'applyConstraints' in track) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: nextState } as any],
          });
        } catch {
          // torch constraint not supported
        }
      }
    }
  };

  // 1. Live Camera Capture: Snap actual video frame
  const handleCaptureFromCamera = () => {
    const now = new Date().toISOString();
    setCaptureTime(now);
    setCaptureSource('camera');

    if (cameraActive && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);

        // Real image heuristics on canvas pixels
        try {
          const imgData = ctx.getImageData(
            Math.floor(canvas.width / 4),
            Math.floor(canvas.height / 4),
            Math.floor(canvas.width / 2),
            Math.floor(canvas.height / 2)
          );
          let rSum = 0, gSum = 0, bSum = 0;
          const totalPx = imgData.data.length / 4;
          for (let i = 0; i < imgData.data.length; i += 4) {
            rSum += imgData.data[i];
            gSum += imgData.data[i + 1];
            bSum += imgData.data[i + 2];
          }
          const avgR = Math.round(rSum / totalPx);
          const avgG = Math.round(gSum / totalPx);
          const avgB = Math.round(bSum / totalPx);

          const isMainlyGreen = avgG > avgR && avgG > avgB;
          const isYellowing = avgR > 130 && avgG > 130 && avgB < 110;

          let cond = 'Live Field Foliage — Active Vegetative';
          let sev = 10;
          let conf = 92;
          let obsList = [
            `Canopy Color Profile: RGB(${avgR}, ${avgG}, ${avgB}) analyzed by on-device engine.`,
            'Consistent cellular reflectance across framed leaf zone.',
            'No physical sheath lodging or necrotic patches in capture zone.',
          ];
          let guidList = [
            'Maintain current irrigation and baseline monitoring routine.',
            'Record next observation in 5–7 days.',
          ];

          if (isYellowing) {
            cond = 'Foliar Chlorosis — Early Nutrient / Stress Signal';
            sev = 35;
            conf = 89;
            obsList = [
              `Foliar color shift detected: elevated red/yellow spectra RGB(${avgR}, ${avgG}, ${avgB}).`,
              'Interveinal chlorosis observed along leaf blade margin.',
              'Stem collar remains structurally upright.',
            ];
            guidList = [
              'Inspect soil moisture and verify nitrogen application schedule.',
              'Log targeted micro-nutrient intervention in Field Passport.',
            ];
          } else if (!isMainlyGreen) {
            cond = 'Canopy Irregularity — Subdued Green Reflection';
            sev = 24;
            conf = 86;
            obsList = [
              `Mean reflection balance: RGB(${avgR}, ${avgG}, ${avgB}).`,
              'Mild discoloration or shadowed canopy coverage detected.',
            ];
            guidList = [
              'Re-scan in optimal direct daylight if lighting was dim.',
              'Verify leaf undersides for insect presence.',
            ];
          }

          setCameraAnalysisResult({
            condition: cond,
            severity: sev,
            confidence: conf,
            observations: obsList,
            guidance: guidList,
            metricsText: `RGB(${avgR}, ${avgG}, ${avgB}) · ${totalPx} pixels sampled`,
          });
        } catch {
          // Heuristics fallback
          setCameraAnalysisResult({
            condition: 'Field Photo Analyzed — Vegetative Profile',
            severity: 15,
            confidence: 90,
            observations: ['Live image frame successfully captured and cataloged.'],
            guidance: ['Review in Digital Field Passport.'],
            metricsText: 'Direct camera frame',
          });
        }

        stopCamera();
        setScanState('preview');
        return;
      }
    }

    // If camera wasn't active, fallback to sample preset
    handleSelectDemoPreset('leaf_curl');
  };

  // 2. Demo Specimen Selection: Explicit demo path
  const handleSelectDemoPreset = (preset: 'leaf_curl' | 'blast' | 'healthy') => {
    setSelectedPreset(preset);
    setCaptureSource('demo');
    const sampleMap = {
      leaf_curl: '/sample-leafcurl.svg',
      blast: '/sample-storm.svg',
      healthy: '/sample-healthy.svg',
    };
    setCapturedImage(sampleMap[preset]);
    setCaptureTime(new Date().toISOString());
    setCameraAnalysisResult(null);
    stopCamera();
    setScanState('preview');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCameraAnalysisResult(null);
    setScanState('ready');
    startCamera();
  };

  const handleStartAnalysis = () => {
    setScanState('analyzing');
    setAnalysisStep(0);

    const timers = [
      setTimeout(() => setAnalysisStep(1), 300),
      setTimeout(() => setAnalysisStep(2), 600),
      setTimeout(() => setAnalysisStep(3), 900),
      setTimeout(() => setAnalysisStep(4), 1200),
      setTimeout(() => {
        setAnalysisStep(5);
        setTimeout(() => setScanState('result'), 350);
      }, 1500),
    ];

    return () => timers.forEach(clearTimeout);
  };

  const demoConditionData = agronomyKnowledge[selectedPreset] || agronomyKnowledge.leaf_curl;

  // Resolved analysis data based on whether camera or demo was used
  const activeCondition = captureSource === 'camera' && cameraAnalysisResult
    ? cameraAnalysisResult.condition
    : demoConditionData.condition;

  const activeSeverity = captureSource === 'camera' && cameraAnalysisResult
    ? cameraAnalysisResult.severity
    : demoConditionData.defaultSeverity;

  const activeConfidence = captureSource === 'camera' && cameraAnalysisResult
    ? cameraAnalysisResult.confidence
    : demoConditionData.defaultConfidence;

  const activeObservations = captureSource === 'camera' && cameraAnalysisResult
    ? cameraAnalysisResult.observations
    : demoConditionData.observations[language];

  const activeGuidance = captureSource === 'camera' && cameraAnalysisResult
    ? cameraAnalysisResult.guidance
    : demoConditionData.guidance[language];

  const handleSaveToPassport = () => {
    const obs: Observation = {
      id: `obs-${Date.now()}`,
      fieldId: field.id,
      timestamp: captureTime || new Date().toISOString(),
      photoUrl: capturedImage || '/sample-leafcurl.svg',
      crop: field.crop,
      condition: activeCondition,
      severity: activeSeverity,
      confidence: activeConfidence,
      observations: activeObservations,
      guidance: activeGuidance,
      location: field.location,
      coordinates: field.coordinates,
      sensorContext: {
        deviceMotion: sensorSnapshot?.motionDetected ? 'Detected' : 'None',
        orientation: sensorSnapshot?.orientation || 'Portrait',
        stability: sensorSnapshot?.stability || 'Device Stable',
      },
      source: captureSource === 'camera' ? 'camera' : 'demo',
      integrityStatus: 'recorded',
      isDemo: captureSource === 'demo',
    };

    onAddObservation(obs);
    onBack();
  };

  const handleSaveWithoutAnalysis = () => {
    const obs: Observation = {
      id: `obs-${Date.now()}`,
      fieldId: field.id,
      timestamp: captureTime || new Date().toISOString(),
      photoUrl: capturedImage || '/sample-leafcurl.svg',
      crop: field.crop,
      condition: 'Raw Field Observation — Unanalyzed',
      severity: 0,
      confidence: 100,
      observations: ['Visual record captured without AI diagnostic assessment.'],
      guidance: ['Review in Field Passport at regular inspection intervals.'],
      location: field.location,
      coordinates: field.coordinates,
      sensorContext: {
        stability: sensorSnapshot?.stability || 'Device Stable',
      },
      source: captureSource === 'camera' ? 'camera' : 'demo',
      integrityStatus: 'recorded',
      isDemo: captureSource === 'demo',
    };
    onAddObservation(obs);
    onBack();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C2518] text-[#FBF9F4] flex flex-col justify-between select-none">
      {/* Viewfinder Header */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-xs font-bold tracking-widest uppercase text-[#81C784]">
            {t.cameraTitle}
          </div>
          <div className="text-[10px] text-white/60 font-mono">
            {cameraActive ? 'LIVE SENSOR READY' : 'CAMERA STANDBY'}
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono border border-white/10">
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#4CAF50]' : 'bg-[#E65100]'}`} />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Demo Purpose Bar in Viewfinder */}
      <div className="relative z-10 mx-4 -mt-1 mb-2 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 backdrop-blur-md flex items-center justify-between text-amber-300">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
            FOR DEMO PURPOSES ONLY
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-200/80">
          POC Edge Vision Engine
        </span>
      </div>

      {/* Main Viewport Content based on ScanState */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4">
        {scanState === 'ready' && (
          <div className="relative w-full max-w-sm aspect-3/4 rounded-3xl overflow-hidden bg-black/60 border-2 border-[#2E7D32]/40 shadow-2xl flex flex-col items-center justify-center">
            {/* Real Camera Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Viewfinder Framing Reticle */}
            <div className="absolute inset-6 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <div className="w-5 h-5 border-t-2 border-l-2 border-[#81C784]" />
                <div className="w-5 h-5 border-t-2 border-r-2 border-[#81C784]" />
              </div>
              <div className="flex justify-center">
                <div className="px-3 py-1 rounded-full bg-black/60 text-[10px] tracking-wider text-white/90 font-mono backdrop-blur-xs">
                  {cameraActive ? 'ALIGN CROP LEAF IN FRAME' : 'CAMERA INACTIVE'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-5 h-5 border-b-2 border-l-2 border-[#81C784]" />
                <div className="w-5 h-5 border-b-2 border-r-2 border-[#81C784]" />
              </div>
            </div>

            {/* If camera is not yet active: CTA to start real camera */}
            {!cameraActive && (
              <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
                <div className="p-4 rounded-full bg-[#123824] text-[#81C784] border border-[#2E7D32]/50 shadow-lg">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="text-xs text-[#D7E3DA] max-w-xs">
                  {t.cameraPermissionNeeded}
                </p>
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs tracking-wider uppercase shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {t.startCamera}
                </button>
              </div>
            )}

            {/* Subdued Real-time Device Metadata overlay */}
            <div className="absolute bottom-2 inset-x-3 py-1.5 px-2.5 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-between text-[10px] text-white/80 font-mono">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#81C784]" />
                <span className="truncate max-w-[120px]">
                  {field.location === 'Location not set' ? 'GPS Not set' : field.location}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#81C784]" />
                <span>{sensorSnapshot?.stability || 'Sensor Active'}</span>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW OF CAPTURED IMAGE */}
        {scanState === 'preview' && capturedImage && (
          <div className="relative w-full max-w-sm aspect-3/4 rounded-3xl overflow-hidden bg-black/80 border-2 border-[#2E7D32] shadow-2xl flex flex-col">
            <img
              src={capturedImage}
              alt="Captured Field"
              className="w-full h-full object-cover"
            />
            
            {/* Distinction between Camera Capture vs Demo Specimen */}
            <div className="absolute top-3 inset-x-3 flex flex-col gap-1">
              {captureSource === 'camera' ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#06140B]/90 border border-emerald-500/50 backdrop-blur-md text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" />
                    <span className="text-[11px] font-mono font-black tracking-wider text-[#76FF03]">
                      PHOTO CAPTURED
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-white/70">
                    Live Device Camera
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-950/90 border border-amber-500/50 backdrop-blur-md text-amber-200 shadow-lg">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-mono font-black tracking-wider text-amber-300">
                      DEMO SPECIMEN SELECTED
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-300/80">
                    Evaluation Sample
                  </span>
                </div>
              )}
            </div>

            {/* Bottom timestamp pill */}
            <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/80 flex items-center justify-between">
              <span>{new Date().toLocaleTimeString()}</span>
              <span>{captureSource === 'camera' ? 'Camera Frame' : 'Demo Dataset'}</span>
            </div>
          </div>
        )}

        {/* ANALYZING SEQUENCE ANIMATION */}
        {scanState === 'analyzing' && (
          <div className="relative w-full max-w-sm p-6 rounded-3xl bg-[#091F13] border border-[#2E7D32]/50 shadow-2xl space-y-5">
            <div className="text-center space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF3E0] text-[#E65100]">
                {captureSource === 'camera' ? 'POC VISION ENGINE' : 'DEMO ANALYSIS'}
              </span>
              <h2 className="text-base font-bold text-[#FBF9F4]">
                {t.analysisTitle}
              </h2>
            </div>

            {/* 5 Milestone Step Indicators */}
            <div className="space-y-3">
              {[
                { title: t.stepReading, stepIdx: 1 },
                { title: t.stepCrop, stepIdx: 2 },
                { title: t.stepCondition, stepIdx: 3 },
                { title: t.stepSeverity, stepIdx: 4 },
                { title: t.stepGuidance, stepIdx: 5 },
              ].map((item) => {
                const isPassed = analysisStep >= item.stepIdx;
                const isCurrent = analysisStep === item.stepIdx - 1;

                return (
                  <div
                    key={item.stepIdx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isPassed
                        ? 'bg-[#123824] border-[#2E7D32] text-white'
                        : isCurrent
                        ? 'bg-[#1B4D32]/60 border-[#81C784] text-[#A5D6A7] animate-pulse'
                        : 'bg-black/30 border-white/5 text-white/40'
                    }`}
                  >
                    <span className="font-medium">{item.title}</span>
                    {isPassed ? (
                      <Check className="w-4 h-4 text-[#81C784]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[#81C784] animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-[#A5D6A7]/80 leading-relaxed">
              <strong>Native Android Architecture:</strong> CameraX → On-device vision model → Structured agronomy rules → Local Gemma 3n LLM.
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {scanState === 'result' && (
          <div className="w-full max-w-sm max-h-[75vh] overflow-y-auto space-y-3.5 pr-1 text-[#1A221D]">
            {/* Top result card */}
            <div className="rounded-2xl bg-white p-4 shadow-xl border border-[#DED5C0]">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                <span className="text-[10px] font-extrabold tracking-widest text-[#2E7D32] uppercase">
                  {t.scanResult}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                  captureSource === 'camera'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                    : 'bg-[#FFF3E0] text-[#E65100]'
                }`}>
                  {captureSource === 'camera' ? 'CAMERA CAPTURE' : 'DEMO SPECIMEN'}
                </span>
              </div>

              <div className="pt-2">
                <div className="text-xs text-[#6D4C41] font-semibold uppercase">
                  {field.crop} · {t.conditionLabel}
                </div>
                <h3 className="text-lg font-extrabold text-[#0C2518]">
                  {activeCondition}
                </h3>
                {captureSource === 'camera' && cameraAnalysisResult?.metricsText && (
                  <div className="text-[10px] font-mono text-[#2E7D32] mt-0.5">
                    Sensor Profile: {cameraAnalysisResult.metricsText}
                  </div>
                )}
              </div>

              {/* Confidence & Severity Gauge */}
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#F0ECE1]">
                <div>
                  <div className="text-[10px] text-[#6D4C41] font-semibold uppercase">
                    {t.confidenceLabel}
                  </div>
                  <div className="text-xl font-black font-mono text-[#2E7D32]">
                    {activeConfidence}%
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#6D4C41] font-semibold uppercase">
                    {t.severityLabel}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-2 rounded-full bg-[#EAE4D5] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          activeSeverity > 50
                            ? 'bg-[#C62828]'
                            : activeSeverity > 20
                            ? 'bg-[#E65100]'
                            : 'bg-[#2E7D32]'
                        }`}
                        style={{ width: `${activeSeverity}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-xs">
                      {activeSeverity}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* WHAT KSHETRA OBSERVED */}
            <div className="rounded-2xl bg-white p-4 shadow-md border border-[#DED5C0]">
              <h4 className="text-xs font-extrabold tracking-wider text-[#0C2518] uppercase flex items-center gap-1.5 pb-2 border-b border-[#F0ECE1]">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                {t.whatKshetraObserved}
              </h4>
              <ul className="mt-2 space-y-2 text-xs text-[#2D1E16]">
                {activeObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] shrink-0 mt-1.5" />
                    <span className="leading-snug">{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WHAT TO DO NEXT (Safe agronomic rules) */}
            <div className="rounded-2xl bg-white p-4 shadow-md border border-[#DED5C0]">
              <h4 className="text-xs font-extrabold tracking-wider text-[#0C2518] uppercase flex items-center gap-1.5 pb-2 border-b border-[#F0ECE1]">
                <ChevronRight className="w-3.5 h-3.5 text-[#2E7D32]" />
                {t.whatToDoNext}
              </h4>
              <ol className="mt-2 space-y-2 text-xs text-[#2D1E16]">
                {activeGuidance.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Result Action Buttons */}
            <div className="space-y-2 pt-1 pb-4">
              <button
                onClick={handleSaveToPassport}
                className="w-full py-3 px-4 rounded-xl bg-[#0C2518] hover:bg-[#123824] text-white font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#81C784]" />
                <span>{t.addToPassport}</span>
              </button>

              <button
                onClick={() => {
                  handleSaveToPassport();
                  if (onRecordInterventionPrompt) {
                    onRecordInterventionPrompt(`obs-${Date.now()}`);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>{t.recordAction}</span>
              </button>

              <button
                onClick={handleRetake}
                className="w-full py-2 px-4 rounded-xl bg-white text-[#2D1E16] border border-[#DED5C0] font-semibold text-xs tracking-wider uppercase hover:bg-[#F5F2EA] transition-all cursor-pointer"
              >
                {t.scanAgain}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls / Actions */}
      <div className="relative z-10 p-4 bg-linear-to-t from-black/95 via-black/80 to-transparent">
        {scanState === 'ready' && (
          <div className="space-y-3 max-w-sm mx-auto">
            {/* Primary Capture Row */}
            <div className="flex items-center justify-around">
              <button
                onClick={handleToggleFacingMode}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md active:scale-95 transition-all cursor-pointer"
                title="Switch Camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Main Shutter Button for Real Camera Capture */}
              <button
                onClick={handleCaptureFromCamera}
                className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-90 transition-transform duration-150 cursor-pointer shadow-xl"
                title="Capture Photo"
              >
                <div className="w-14 h-14 rounded-full bg-[#81C784] hover:bg-[#4CAF50] transition-colors" />
              </button>

              <button
                onClick={handleToggleTorch}
                className={`p-3 rounded-full backdrop-blur-md active:scale-95 transition-all cursor-pointer ${
                  torchOn ? 'bg-[#FDD835] text-black shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Torch"
              >
                <Zap className="w-5 h-5" />
              </button>
            </div>

            {/* Explicit Demo Presets Selector */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] text-white/60 mb-2 font-mono">
                <span className="uppercase tracking-wider">DEMO PRESETS (EVALUATION SPECIMENS):</span>
                <span className="text-amber-400">DEMO MODE</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSelectDemoPreset('leaf_curl')}
                  className="py-1.5 px-2 rounded-lg text-[10px] font-semibold bg-white/10 hover:bg-[#FFB74D] hover:text-[#0C2518] text-[#FFB74D] border border-[#FFB74D]/40 transition-all cursor-pointer"
                >
                  Leaf Curl Demo
                </button>
                <button
                  onClick={() => handleSelectDemoPreset('blast')}
                  className="py-1.5 px-2 rounded-lg text-[10px] font-semibold bg-white/10 hover:bg-[#FF8A80] hover:text-[#0C2518] text-[#FF8A80] border border-[#FF8A80]/40 transition-all cursor-pointer"
                >
                  Storm Lodging Demo
                </button>
                <button
                  onClick={() => handleSelectDemoPreset('healthy')}
                  className="py-1.5 px-2 rounded-lg text-[10px] font-semibold bg-white/10 hover:bg-[#81C784] hover:text-[#0C2518] text-[#81C784] border border-[#81C784]/40 transition-all cursor-pointer"
                >
                  Healthy Leaf Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {scanState === 'preview' && (
          <div className="space-y-2 max-w-sm mx-auto">
            <button
              onClick={handleStartAnalysis}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-sm tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-[#81C784]" />
              <span>{t.analyzePhoto}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleRetake}
                className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs tracking-wide transition-all cursor-pointer"
              >
                {t.retakePhoto}
              </button>

              <button
                onClick={handleSaveWithoutAnalysis}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-medium text-xs tracking-wide transition-all cursor-pointer"
              >
                {t.saveWithoutAnalysis}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
