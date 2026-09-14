import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  RefreshCw
} from 'lucide-react';

interface Cryptographic3DBlockProps {
  hash: string;
  isTampered: boolean;
  isVerified?: boolean;
  className?: string;
  onRestore?: () => void;
}

export const Cryptographic3DBlock: FC<Cryptographic3DBlockProps> = ({
  hash,
  isTampered,
  isVerified: _isVerified = false,
  className = '',
  onRestore,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeMeshRef = useRef<THREE.Mesh | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const innerRingRef = useRef<THREE.Mesh | null>(null);
  const fractureWireframeRef = useRef<THREE.LineSegments | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Drag interaction
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const blockRotationRef = useRef({ x: 0.35, y: 0.45 });

  // Main Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06140b);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
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

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Internal Glow PointLight (Emerald when secure, Red when tampered)
    const glowLight = new THREE.PointLight(
      isTampered ? 0xff1744 : 0x76ff03,
      2.8,
      12
    );
    glowLight.position.set(0, 0, 0);
    scene.add(glowLight);
    pointLightRef.current = glowLight;

    // 1. Outer Translucent Crystal Monolith (Cryptographic Block)
    const cubeGeo = new THREE.BoxGeometry(2.6, 2.6, 2.6);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: isTampered ? 0x4a0a0f : 0x0c2518,
      emissive: isTampered ? 0x550000 : 0x0a2210,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.65, // Translucent glass appearance
      transparent: true,
      opacity: 0.88,
      ior: 1.5,
    });
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    scene.add(cubeMesh);
    cubeMeshRef.current = cubeMesh;

    // Outer Edge Wireframe
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: isTampered ? 0xff5252 : 0x76ff03,
      linewidth: 2,
    });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    cubeMesh.add(edges);

    // 2. Inner Cryptographic Core (Octahedron representing the SHA-256 seal)
    const coreGeo = new THREE.OctahedronGeometry(1.0, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isTampered ? 0xff1744 : 0x00e676,
      emissive: isTampered ? 0x990000 : 0x1b5e20,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    cubeMesh.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 3. Inner Orbiting Hash Ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.05, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isTampered ? 0xff5252 : 0x81c784,
    });
    const innerRing = new THREE.Mesh(ringGeo, ringMat);
    cubeMesh.add(innerRing);
    innerRingRef.current = innerRing;

    // 4. Fracture Cracks Wireframe (Visible when tampered)
    const fractureGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const fractureMat = new THREE.LineBasicMaterial({
      color: 0xff1744,
      transparent: true,
      opacity: isTampered ? 0.9 : 0,
    });
    const fractureWireframe = new THREE.LineSegments(new THREE.WireframeGeometry(fractureGeo), fractureMat);
    cubeMesh.add(fractureWireframe);
    fractureWireframeRef.current = fractureWireframe;

    // 5. Orbiting Cryptographic Hash Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 2.0 + Math.random() * 1.5;

      particlePositions[i] = dist * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = dist * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = dist * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: isTampered ? 0xff5252 : 0x76ff03,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate whole block
      if (cubeMeshRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          blockRotationRef.current.y += 0.008;
          blockRotationRef.current.x = 0.25 + Math.sin(elapsed * 0.5) * 0.15;
        }
        cubeMeshRef.current.rotation.x = blockRotationRef.current.x;
        cubeMeshRef.current.rotation.y = blockRotationRef.current.y;
      }

      // Rotate internal core & ring opposite direction
      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.y = -elapsed * 1.5;
        coreMeshRef.current.rotation.z = elapsed * 0.8;
      }

      if (innerRingRef.current) {
        innerRingRef.current.rotation.x = elapsed * 1.2;
        innerRingRef.current.rotation.y = elapsed * 0.9;
      }

      // Particle orbit
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.15;
        particlesRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.2;
      }

      // Tampered state glitch / flickering
      if (isTampered && pointLightRef.current) {
        pointLightRef.current.intensity = 2.0 + Math.sin(elapsed * 18) * 1.5;
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
      cubeGeo.dispose();
      edgesGeo.dispose();
      coreGeo.dispose();
      ringGeo.dispose();
      fractureGeo.dispose();
      particleGeo.dispose();
      renderer.dispose();
    };
  }, [isTampered, autoRotate]);

  // Pointer drag controls to rotate 3D evidence cube
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    blockRotationRef.current.y += deltaX * 0.01;
    blockRotationRef.current.x += deltaY * 0.01;

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
      className={`relative w-full rounded-2xl overflow-hidden bg-[#06140B] select-none border border-emerald-950/80 shadow-2xl min-h-[300px] ${className}`}
    >
      {/* 3D WebGL Monolith Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
      />

      {/* Top Left: Cryptographic Status Hologram */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg backdrop-blur-md border shadow-lg pointer-events-auto ${
          isTampered 
            ? 'bg-red-950/90 border-red-500/50 text-red-300' 
            : 'bg-[#0C2518]/90 border-emerald-500/50 text-[#76FF03]'
        }`}>
          {isTampered ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                INTEGRITY BREACH • SIGNATURE MISMATCH
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#76FF03]" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                3D CRYPTO VAULT • SHA-256 SEALED
              </span>
            </>
          )}
        </div>

        <div className="px-2.5 py-1.5 rounded-lg bg-[#06140B]/80 backdrop-blur-sm border border-emerald-900/40 text-[9px] font-mono text-emerald-200/90 space-y-0.5 max-w-[260px] truncate">
          <div>CANONICAL DIGEST:</div>
          <div className="text-white font-bold truncate">{hash}</div>
        </div>
      </div>

      {/* Top Right: Rotation & Restore Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {isTampered && onRestore && (
          <button
            onClick={onRestore}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-md transition-all animate-bounce"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restore Block</span>
          </button>
        )}

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

      {/* Bottom Center: Gesture Instructions */}
      <div className="absolute bottom-3 inset-x-0 mx-auto w-fit px-3 py-1 rounded-full bg-[#06140B]/80 backdrop-blur-md border border-emerald-900/60 text-[9px] font-medium text-emerald-300/80 flex items-center gap-1.5 shadow-md pointer-events-none">
        <Lock className="w-3 h-3 text-[#76FF03]" />
        <span>Drag to rotate cryptographic facets • Inspect internal hash core</span>
      </div>
    </div>
  );
};
