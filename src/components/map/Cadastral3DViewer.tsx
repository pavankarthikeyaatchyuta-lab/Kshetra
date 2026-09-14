import { useEffect, useRef, useState, useCallback } from 'react';
import type { FC } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Compass, 
  Maximize2, 
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import type { Field } from '../../models/types';

interface Cadastral3DViewerProps {
  field: Field;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

type LayerMode = 'satellite' | 'ndvi' | 'topo';

export const Cadastral3DViewer: FC<Cadastral3DViewerProps> = ({
  field,
  isFullscreen = false,
  onToggleFullscreen,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction & visual state
  const [layerMode, setLayerMode] = useState<LayerMode>('ndvi');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [droneAltitude, setDroneAltitude] = useState<number>(38);
  const [showHud] = useState<boolean>(true);

  // References to Three.js objects for dynamic updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);
  const beaconGroupRef = useRef<THREE.Group | null>(null);
  const boundaryLineRef = useRef<THREE.Line | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Interaction drag state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef({
    radius: 38,
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
  });

  // Generate procedural canvas texture for satellite and NDVI layers
  const createProceduralTextures = useCallback(() => {
    // 1. Satellite texture
    const satCanvas = document.createElement('canvas');
    satCanvas.width = 512;
    satCanvas.height = 512;
    const satCtx = satCanvas.getContext('2d')!;

    // Rich agricultural paddy field background
    satCtx.fillStyle = '#1A381F';
    satCtx.fillRect(0, 0, 512, 512);

    // Terraced bunds & crop strips
    for (let i = 0; i < 512; i += 24) {
      satCtx.fillStyle = i % 48 === 0 ? '#143018' : '#234928';
      satCtx.fillRect(0, i, 512, 20);

      satCtx.strokeStyle = '#2E5E35';
      satCtx.lineWidth = 2;
      satCtx.beginPath();
      satCtx.moveTo(0, i + 20);
      satCtx.lineTo(512, i + 20);
      satCtx.stroke();
    }

    // Organic crop heterogeneity
    for (let i = 0; i < 60; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const r = 15 + Math.random() * 45;
      const grad = satCtx.createRadialGradient(rx, ry, 0, rx, ry, r);
      grad.addColorStop(0, 'rgba(56, 142, 60, 0.4)');
      grad.addColorStop(1, 'rgba(26, 56, 31, 0)');
      satCtx.fillStyle = grad;
      satCtx.beginPath();
      satCtx.arc(rx, ry, r, 0, Math.PI * 2);
      satCtx.fill();
    }

    const satTexture = new THREE.CanvasTexture(satCanvas);
    satTexture.wrapS = THREE.RepeatWrapping;
    satTexture.wrapT = THREE.RepeatWrapping;

    // 2. NDVI Thermal / Chlorophyll Health Map
    const ndviCanvas = document.createElement('canvas');
    ndviCanvas.width = 512;
    ndviCanvas.height = 512;
    const ndviCtx = ndviCanvas.getContext('2d')!;

    // Mostly lush optimal green (NDVI 0.82)
    ndviCtx.fillStyle = '#2E7D32';
    ndviCtx.fillRect(0, 0, 512, 512);

    // Vibrant chlorophyll zones (NDVI 0.90+)
    for (let i = 0; i < 20; i++) {
      const rx = 80 + Math.random() * 340;
      const ry = 80 + Math.random() * 340;
      const r = 40 + Math.random() * 60;
      const grad = ndviCtx.createRadialGradient(rx, ry, 0, rx, ry, r);
      grad.addColorStop(0, '#76FF03');
      grad.addColorStop(0.6, '#4CAF50');
      grad.addColorStop(1, 'rgba(46, 125, 50, 0)');
      ndviCtx.fillStyle = grad;
      ndviCtx.beginPath();
      ndviCtx.arc(rx, ry, r, 0, Math.PI * 2);
      ndviCtx.fill();
    }

    // Stress / disease hotspot on northeast corner (NDVI 0.42)
    const stressGrad = ndviCtx.createRadialGradient(380, 130, 0, 380, 130, 90);
    stressGrad.addColorStop(0, '#FF3D00');
    stressGrad.addColorStop(0.4, '#FFB300');
    stressGrad.addColorStop(0.8, '#8BC34A');
    stressGrad.addColorStop(1, 'rgba(46, 125, 50, 0)');
    ndviCtx.fillStyle = stressGrad;
    ndviCtx.beginPath();
    ndviCtx.arc(380, 130, 90, 0, Math.PI * 2);
    ndviCtx.fill();

    const ndviTexture = new THREE.CanvasTexture(ndviCanvas);

    return { satTexture, ndviTexture };
  }, []);

  // Update material based on selected layerMode
  useEffect(() => {
    if (!terrainMeshRef.current || !wireframeMeshRef.current) return;

    const { satTexture, ndviTexture } = createProceduralTextures();

    if (layerMode === 'satellite') {
      terrainMeshRef.current.material = new THREE.MeshStandardMaterial({
        map: satTexture,
        roughness: 0.85,
        metalness: 0.1,
        flatShading: true,
      });
      wireframeMeshRef.current.visible = false;
    } else if (layerMode === 'ndvi') {
      terrainMeshRef.current.material = new THREE.MeshStandardMaterial({
        map: ndviTexture,
        roughness: 0.6,
        metalness: 0.15,
        emissive: new THREE.Color(0x0a2210),
        flatShading: true,
      });
      wireframeMeshRef.current.visible = true;
    } else if (layerMode === 'topo') {
      terrainMeshRef.current.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0c2518),
        roughness: 0.9,
        metalness: 0.2,
        wireframe: false,
      });
      wireframeMeshRef.current.visible = true;
    }
  }, [layerMode, createProceduralTextures]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06140b);
    scene.fog = new THREE.FogExp2(0x06140b, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff4db, 1.8);
    sunLight.position.set(30, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Accent emerald backlight
    const greenLight = new THREE.PointLight(0x76ff03, 1.5, 60);
    greenLight.position.set(0, 15, 0);
    scene.add(greenLight);

    // 1. Procedural 3D Terrain Geometry with Parcel KR-1042 Elevation
    const gridX = 48;
    const gridY = 48;
    const terrainGeo = new THREE.PlaneGeometry(36, 36, gridX, gridY);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Organic ridge elevation + terraced bund steps
      const elevation = 
        Math.sin(x * 0.35) * 1.1 +
        Math.cos(z * 0.3) * 0.9 +
        Math.sin(x * 0.8 + z * 0.6) * 0.45;

      posAttr.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const { ndviTexture } = createProceduralTextures();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: ndviTexture,
      roughness: 0.6,
      metalness: 0.15,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // Topo Contour Wireframe
    const wireframeGeo = new THREE.WireframeGeometry(terrainGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x4caf50,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    scene.add(wireframeMesh);
    wireframeMeshRef.current = wireframeMesh;

    // 2. Boundary Pegs & Cadastral Laser Boundary Line
    const boundaryPoints = [
      new THREE.Vector3(-14, 1.5, -14),
      new THREE.Vector3(14, 2.0, -13),
      new THREE.Vector3(15, 0.8, 14),
      new THREE.Vector3(-13, 0.6, 13),
      new THREE.Vector3(-14, 1.5, -14),
    ];

    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryMat = new THREE.LineBasicMaterial({
      color: 0x76ff03,
      linewidth: 3,
      transparent: true,
      opacity: 0.9,
    });
    const boundaryLine = new THREE.Line(boundaryGeo, boundaryMat);
    scene.add(boundaryLine);
    boundaryLineRef.current = boundaryLine;

    // Boundary Survey Peg Pillars (at the 4 corners)
    const pegGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.2, 8);
    const pegMat = new THREE.MeshStandardMaterial({
      color: 0xfff275,
      emissive: 0x332200,
      metalness: 0.8,
      roughness: 0.2,
    });

    boundaryPoints.slice(0, 4).forEach((pt) => {
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(pt.x, pt.y + 0.8, pt.z);
      scene.add(peg);

      // Pulsing corner beacon
      const light = new THREE.PointLight(0x76ff03, 0.8, 8);
      light.position.set(pt.x, pt.y + 2.0, pt.z);
      scene.add(light);
    });

    // 3. Central Holographic Beacon for Field Centroid
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, 2.2, 0);

    // Glowing core diamond
    const coreGeo = new THREE.OctahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x76ff03,
      emissive: 0x4caf50,
      roughness: 0.1,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    beaconGroup.add(coreMesh);

    // Holographic Pulse Rings
    const ringGeo = new THREE.RingGeometry(1.2, 1.4, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x81c784,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ringMesh2.scale.set(1.5, 1.5, 1.5);
    beaconGroup.add(ringMesh1);
    beaconGroup.add(ringMesh2);

    scene.add(beaconGroup);
    beaconGroupRef.current = beaconGroup;

    // 4. Ambient Floating Dust & Spore Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 44;
      particlePositions[i + 1] = 1 + Math.random() * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 44;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xa5d6a7,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto-orbit camera when enabled
      if (autoRotate && !isDraggingRef.current) {
        cameraTargetRef.current.theta += 0.0035;
      }

      // Compute camera position from spherical coordinates
      const { radius, theta, phi } = cameraTargetRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 1.5, 0);

      // Centroid beacon animation
      if (beaconGroupRef.current) {
        beaconGroupRef.current.rotation.y = elapsedTime * 1.2;
        coreMesh.rotation.x = elapsedTime * 0.8;
        coreMesh.position.y = Math.sin(elapsedTime * 2) * 0.25;

        ringMesh1.scale.setScalar(1 + (Math.sin(elapsedTime * 2.5) * 0.2));
        ringMesh2.scale.setScalar(1.4 + (Math.cos(elapsedTime * 2.5) * 0.25));
      }

      // Particle drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
      }

      // Pulsing boundary line opacity
      if (boundaryLineRef.current) {
        (boundaryLineRef.current.material as THREE.LineBasicMaterial).opacity = 
          0.7 + Math.sin(elapsedTime * 3) * 0.25;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      terrainGeo.dispose();
      wireframeGeo.dispose();
      boundaryGeo.dispose();
      pegGeo.dispose();
      coreGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();
      renderer.dispose();
    };
  }, [autoRotate, createProceduralTextures]);

  // Touch & Mouse Orbit Drag Controls
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cameraTargetRef.current.theta -= deltaX * 0.007;
    cameraTargetRef.current.phi = Math.max(
      0.3,
      Math.min(Math.PI / 2 - 0.05, cameraTargetRef.current.phi - deltaY * 0.007)
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

  // Zoom handlers
  const handleZoom = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? -5 : 5;
    const newRadius = Math.max(16, Math.min(65, cameraTargetRef.current.radius + delta));
    cameraTargetRef.current.radius = newRadius;
    setDroneAltitude(Math.round(newRadius));
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 3 : -3;
    const newRadius = Math.max(16, Math.min(65, cameraTargetRef.current.radius + delta));
    cameraTargetRef.current.radius = newRadius;
    setDroneAltitude(Math.round(newRadius));
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full rounded-2xl overflow-hidden bg-[#06140B] select-none border border-emerald-950/60 shadow-xl ${
        isFullscreen ? 'h-full' : 'aspect-16/10 min-h-[300px]'
      } ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
      />

      {/* Top Left: 3D Digital Twin HUD & Mode Indicator */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0C2518]/90 backdrop-blur-md border border-emerald-500/30 shadow-lg pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#76FF03] uppercase">
            3D DIGITAL TWIN • {field.id}
          </span>
        </div>

        {showHud && (
          <div className="px-2.5 py-1.5 rounded-lg bg-[#06140B]/80 backdrop-blur-sm border border-emerald-900/40 text-[9px] font-mono text-emerald-200/80 space-y-0.5">
            <div>ALTITUDE: <span className="text-white font-bold">{droneAltitude}m AGL</span></div>
            <div>MEAN NDVI: <span className="text-[#76FF03] font-bold">0.84 (HEALTHY)</span></div>
            <div>SURVEY PEGS: <span className="text-white font-bold">4 VERIFIED</span></div>
          </div>
        )}
      </div>

      {/* Top Right: Interactive Controls (Layer Switcher & Drone Rotation) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {/* Layer Mode Buttons */}
        <div className="flex bg-[#0C2518]/85 backdrop-blur-md rounded-lg p-0.5 border border-emerald-600/30 shadow-md">
          <button
            onClick={() => setLayerMode('ndvi')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              layerMode === 'ndvi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-300/70 hover:text-white'
            }`}
            title="NDVI Thermal Vegetation Health"
          >
            NDVI
          </button>
          <button
            onClick={() => setLayerMode('satellite')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              layerMode === 'satellite'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-300/70 hover:text-white'
            }`}
            title="Photorealistic Satellite Terraces"
          >
            Satellite
          </button>
          <button
            onClick={() => setLayerMode('topo')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              layerMode === 'topo'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-300/70 hover:text-white'
            }`}
            title="Topographical Elevation Contours"
          >
            Contours
          </button>
        </div>

        {/* Orbit Autoplay */}
        <button
          onClick={() => setAutoRotate(prev => !prev)}
          className={`p-1.5 rounded-lg border backdrop-blur-md transition-colors shadow-md ${
            autoRotate
              ? 'bg-emerald-700/80 border-emerald-400 text-white'
              : 'bg-[#0C2518]/85 border-emerald-600/30 text-emerald-300/70 hover:text-white'
          }`}
          title={autoRotate ? 'Pause Drone Flyover Orbit' : 'Resume Drone Flyover Orbit'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>

        {/* Fullscreen Toggle */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg bg-[#0C2518]/85 border border-emerald-600/30 backdrop-blur-md text-emerald-300/80 hover:text-white transition-colors shadow-md"
            title="Expand Fullscreen 3D View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bottom Left: Zoom Buttons */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1 bg-[#0C2518]/90 backdrop-blur-md rounded-lg border border-emerald-600/30 p-0.5 shadow-md">
        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/40 rounded-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="h-[1px] bg-emerald-800/40" />
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/40 rounded-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Center: Gesture Instructions */}
      <div className="absolute bottom-3 inset-x-0 mx-auto w-fit px-3 py-1 rounded-full bg-[#06140B]/80 backdrop-blur-md border border-emerald-900/60 text-[9px] font-medium text-emerald-300/80 flex items-center gap-1.5 shadow-md pointer-events-none">
        <Compass className="w-3 h-3 text-[#76FF03]" />
        <span>Drag to orbit 360° • Scroll / pinch to inspect</span>
      </div>

      {/* Bottom Right: Legend */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#06140B]/85 backdrop-blur-md border border-emerald-900/50 text-[9px] font-mono text-emerald-200/90">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#76FF03]" />
          <span>Lush (&gt;0.8)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#FFB300]" />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#FF3D00]" />
          <span>Stress</span>
        </div>
      </div>
    </div>
  );
};
