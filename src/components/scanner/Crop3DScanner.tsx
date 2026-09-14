import { useEffect, useRef, useState, useCallback } from 'react';
import type { FC } from 'react';
import * as THREE from 'three';
import { 
  RotateCw
} from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  severity: string;
  confidence: number;
  notes: string;
}

interface Crop3DScannerProps {
  diseaseType?: 'leaf_curl' | 'blast' | 'healthy';
  isScanning?: boolean;
  className?: string;
}

export const Crop3DScanner: FC<Crop3DScannerProps> = ({
  diseaseType = 'blast',
  isScanning: _isScanning = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeMode, setActiveMode] = useState<'standard' | 'thermal' | 'cellular'>('standard');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Hotspots definition based on disease
  const hotspots: Hotspot[] = diseaseType === 'blast' ? [
    {
      id: 'h1',
      name: 'Primary Blast Lesion',
      x: 0.4,
      y: 2.1,
      z: 0.15,
      severity: 'Acute',
      confidence: 89,
      notes: 'Diamond-shaped necrotic center with grey fungal sporulation margin',
    },
    {
      id: 'h2',
      name: 'Early Hyphal Penetration',
      x: -0.3,
      y: -1.2,
      z: 0.1,
      severity: 'Moderate',
      confidence: 78,
      notes: 'Water-soaked lesion showing appressorium attachment',
    },
  ] : diseaseType === 'leaf_curl' ? [
    {
      id: 'h1',
      name: 'Adaxial Inward Rolling',
      x: 0.6,
      y: 1.5,
      z: 0.35,
      severity: 'Moderate',
      confidence: 84,
      notes: 'Stunted vein thickening and cellular hyperplasia',
    },
  ] : [
    {
      id: 'h1',
      name: 'Optimal Cellular Turgor',
      x: 0.0,
      y: 0.5,
      z: 0.1,
      severity: 'Normal',
      confidence: 96,
      notes: 'Even chlorophyll distribution and intact cuticle wax layer',
    },
  ];

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const leafMeshRef = useRef<THREE.Mesh | null>(null);
  const laserPlaneRef = useRef<THREE.Mesh | null>(null);
  const hotspotsGroupRef = useRef<THREE.Group | null>(null);

  // Drag interaction
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const modelRotationRef = useRef({ x: 0.15, y: 0 });

  // Generate procedural leaf texture with veins and disease spots
  const createLeafTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    if (activeMode === 'standard') {
      // Natural Rice Leaf Green
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(0, 0, 512, 1024);

      // Gradient shading from base to tip
      const bladeGrad = ctx.createLinearGradient(0, 1024, 0, 0);
      bladeGrad.addColorStop(0, '#1B5E20');
      bladeGrad.addColorStop(0.5, '#388E3C');
      bladeGrad.addColorStop(1, '#4CAF50');
      ctx.fillStyle = bladeGrad;
      ctx.fillRect(0, 0, 512, 1024);

      // Central Midrib Vein
      ctx.strokeStyle = '#81C784';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(256, 1024);
      ctx.lineTo(256, 0);
      ctx.stroke();

      // Parallel Monocot Leaf Veins
      ctx.strokeStyle = '#43A047';
      ctx.lineWidth = 2.5;
      for (let x = 32; x < 512; x += 16) {
        if (Math.abs(x - 256) < 14) continue;
        ctx.beginPath();
        ctx.moveTo(x, 1024);
        ctx.lineTo(x, 0);
        ctx.stroke();
      }

      // If Blast or Leaf curl, paint realistic lesions
      if (diseaseType === 'blast') {
        // Necrotic diamond spindle spot 1
        const spot1 = ctx.createRadialGradient(310, 320, 4, 310, 320, 65);
        spot1.addColorStop(0, '#424242'); // Ash-grey center
        spot1.addColorStop(0.3, '#5D4037'); // Brown margin
        spot1.addColorStop(0.7, '#FFB300'); // Yellow chlorotic halo
        spot1.addColorStop(1, 'rgba(46, 125, 50, 0)');
        ctx.fillStyle = spot1;
        ctx.beginPath();
        ctx.ellipse(310, 320, 55, 30, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Necrotic lesion 2
        const spot2 = ctx.createRadialGradient(200, 680, 2, 200, 680, 45);
        spot2.addColorStop(0, '#3E2723');
        spot2.addColorStop(0.4, '#8D6E63');
        spot2.addColorStop(0.8, '#FFC107');
        spot2.addColorStop(1, 'rgba(46, 125, 50, 0)');
        ctx.fillStyle = spot2;
        ctx.beginPath();
        ctx.ellipse(200, 680, 38, 22, -Math.PI / 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (activeMode === 'thermal') {
      // Infrared Thermal Specimen
      const thermGrad = ctx.createLinearGradient(0, 0, 512, 1024);
      thermGrad.addColorStop(0, '#000080');
      thermGrad.addColorStop(0.4, '#00E5FF');
      thermGrad.addColorStop(0.7, '#76FF03');
      thermGrad.addColorStop(1, '#FFD600');
      ctx.fillStyle = thermGrad;
      ctx.fillRect(0, 0, 512, 1024);

      // High temperature / fungal spore activity hotspot
      if (diseaseType === 'blast') {
        const hGrad = ctx.createRadialGradient(310, 320, 0, 310, 320, 80);
        hGrad.addColorStop(0, '#FF1744');
        hGrad.addColorStop(0.5, '#FF9100');
        hGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.arc(310, 320, 80, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Cellular stress / holographic wireframe
      ctx.fillStyle = '#06170E';
      ctx.fillRect(0, 0, 512, 1024);

      ctx.strokeStyle = '#00E676';
      ctx.lineWidth = 3;
      for (let y = 0; y < 1024; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }
      for (let x = 0; x < 512; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }, [activeMode, diseaseType]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06140b);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff7d6, 1.6);
    dirLight1.position.set(5, 10, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x76ff03, 0.6);
    dirLight2.position.set(-5, -6, 5);
    scene.add(dirLight2);

    // 1. Curved 3D Leaf Geometry
    const leafGeo = new THREE.PlaneGeometry(2.4, 7.2, 32, 64);
    const pos = leafGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Taper leaf tip and base
      const normalizedY = (y + 3.6) / 7.2; // 0 to 1
      const widthTaper = Math.sin(normalizedY * Math.PI) * 0.95;
      pos.setX(i, x * widthTaper);

      // V-shaped longitudinal arch (monocot leaf midrib)
      const vCurvature = -Math.abs(x * widthTaper) * 0.45;

      // Gentle natural S-curve along stem length
      const longitudinalCurve = Math.sin(normalizedY * Math.PI * 1.3) * 0.45;

      pos.setZ(i, vCurvature + longitudinalCurve);
    }
    leafGeo.computeVertexNormals();

    const leafTexture = createLeafTexture();
    const leafMat = new THREE.MeshStandardMaterial({
      map: leafTexture,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.1,
    });

    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    scene.add(leafMesh);
    leafMeshRef.current = leafMesh;

    // 2. Animated Laser Scan Plane
    const laserGeo = new THREE.PlaneGeometry(3.6, 0.15);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x76ff03,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const laserPlane = new THREE.Mesh(laserGeo, laserMat);
    laserPlane.position.z = 0.5;
    scene.add(laserPlane);
    laserPlaneRef.current = laserPlane;

    // 3. Hotspots Group
    const hotspotsGroup = new THREE.Group();
    leafMesh.add(hotspotsGroup); // Attach to leaf so they rotate with it
    hotspotsGroupRef.current = hotspotsGroup;

    hotspots.forEach((spot) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(spot.x, spot.y, spot.z);

      // Glowing dot
      const dotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: spot.severity === 'Acute' ? 0xff1744 : spot.severity === 'Moderate' ? 0xffb300 : 0x76ff03,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      pinGroup.add(dot);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.18, 0.24, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.severity === 'Acute' ? 0xff1744 : 0x76ff03,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ring);

      hotspotsGroup.add(pinGroup);
    });

    // 4. Ambient Scanning Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 80;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 4;
      pPos[i + 1] = (Math.random() - 0.5) * 8;
      pPos[i + 2] = (Math.random() - 0.5) * 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x76ff03,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    scene.add(pMesh);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Leaf mesh orientation
      if (leafMeshRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          modelRotationRef.current.y = Math.sin(elapsed * 0.8) * 0.45;
        }
        leafMeshRef.current.rotation.x = modelRotationRef.current.x;
        leafMeshRef.current.rotation.y = modelRotationRef.current.y;
      }

      // Laser plane sweep oscillation
      if (laserPlaneRef.current) {
        const sweepY = Math.sin(elapsed * 2.2) * 3.2;
        laserPlaneRef.current.position.y = sweepY;
        (laserPlaneRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(elapsed * 8) * 0.35;
      }

      // Pulse hotspot rings
      if (hotspotsGroupRef.current) {
        hotspotsGroupRef.current.children.forEach((child, idx) => {
          const ring = child.children[1];
          if (ring) {
            const scale = 1 + Math.sin(elapsed * 4 + idx) * 0.35;
            ring.scale.set(scale, scale, 1);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      leafGeo.dispose();
      laserGeo.dispose();
      pGeo.dispose();
      renderer.dispose();
    };
  }, [createLeafTexture, autoRotate, diseaseType]);

  // Pointer drag controls for 3D leaf inspection
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelRotationRef.current.y += deltaX * 0.012;
    modelRotationRef.current.x = Math.max(
      -0.6,
      Math.min(0.6, modelRotationRef.current.x + deltaY * 0.012)
    );

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full rounded-2xl overflow-hidden bg-[#06140B] select-none border border-emerald-900/60 shadow-xl min-h-[360px] ${className}`}
    >
      {/* 3D WebGL Specimen Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
      />

      {/* Top Left: 3D Holographic Scanner HUD */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0C2518]/90 backdrop-blur-md border border-emerald-500/40 shadow-lg pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-[#76FF03] animate-ping" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#76FF03] uppercase">
            3D SPECIMEN SCANNER • ACTIVE
          </span>
        </div>

        <div className="px-2.5 py-1.5 rounded-lg bg-[#06140B]/80 backdrop-blur-sm border border-emerald-900/40 text-[9px] font-mono text-emerald-200/90 space-y-0.5">
          <div>SPECTRAL ABSORBANCE: <span className="text-[#76FF03] font-bold">660 nm (CHL-A)</span></div>
          <div>EPICUTICULAR INTEGRITY: <span className="text-white font-bold">{diseaseType === 'blast' ? '68% COMPROMISED' : '96% INTACT'}</span></div>
          <div>DIAGNOSTIC TARGET: <span className="text-[#FFB300] font-bold">{diseaseType === 'blast' ? 'Pyricularia oryzae' : 'Healthy Turgor'}</span></div>
        </div>
      </div>

      {/* Top Right: Mode Switcher (Standard, Thermal, Cellular) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div className="flex bg-[#0C2518]/85 backdrop-blur-md rounded-lg p-0.5 border border-emerald-600/30 shadow-md">
          <button
            onClick={() => setActiveMode('standard')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeMode === 'standard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            3D Visual
          </button>
          <button
            onClick={() => setActiveMode('thermal')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeMode === 'thermal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            Thermal IR
          </button>
          <button
            onClick={() => setActiveMode('cellular')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              activeMode === 'cellular' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            Matrix
          </button>
        </div>

        {/* Orbit auto rotation toggle */}
        <button
          onClick={() => setAutoRotate(prev => !prev)}
          className={`p-1.5 rounded-lg border backdrop-blur-md transition-colors shadow-md ${
            autoRotate
              ? 'bg-emerald-700/80 border-emerald-400 text-white'
              : 'bg-[#0C2518]/85 border-emerald-600/30 text-emerald-300/70 hover:text-white'
          }`}
          title="Toggle 3D auto rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* Bottom Center: Hotspot Selection Badges */}
      <div className="absolute bottom-3 inset-x-3 flex flex-col gap-2 pointer-events-auto">
        {/* Hotspots chips */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 backdrop-blur-md transition-all border ${
                activeHotspot?.id === spot.id
                  ? 'bg-[#76FF03] text-[#0C2518] border-white shadow-lg scale-105'
                  : 'bg-[#0C2518]/85 text-emerald-200 border-emerald-700/40 hover:border-emerald-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${spot.severity === 'Acute' ? 'bg-red-500' : 'bg-[#76FF03]'}`} />
              <span>{spot.name}</span>
            </button>
          ))}
        </div>

        {/* Active Hotspot Telemetry Card (If clicked) */}
        {activeHotspot && (
          <div className="p-3 rounded-xl bg-[#0C2518]/95 backdrop-blur-md border border-emerald-500/50 shadow-2xl animate-fade-in flex items-start justify-between gap-3 text-left">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{activeHotspot.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950 text-red-300 border border-red-700">
                  {activeHotspot.severity} • {activeHotspot.confidence}% Confidence
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">{activeHotspot.notes}</p>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
