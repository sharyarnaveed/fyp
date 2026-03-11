"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import type { Group, Points, Mesh } from "three";
import { Vector2 } from "three";

/* Mobile detection hook */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* Site palette */
const COLORS = {
  background: "#050F2A",
  foreground: "#F2FDFF",
  primary: "#7BBBFF",
  accent: "#B8A9FF",
  card: "#F2FDFF",
  muted: "#99b3cc",
} as const;

/* ---------------------- EXHAUST PARTICLE SYSTEM ---------------------- */

function ExhaustParticles({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<Points>(null);
  const count = isMobile ? 150 : 600; // Reduced particles on mobile

  const { positions, vel, life } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.3;
      positions[i * 3]     = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -Math.random() * 10;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      vel[i * 3]     = (Math.random() - 0.5) * 0.15;
      vel[i * 3 + 1] = -(0.8 + Math.random() * 1.2);
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      life[i]        = Math.random();
    }
    return { positions, vel, life };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += vel[i * 3]     * delta * 60 * delta;
      pos[i * 3 + 1] += vel[i * 3 + 1] * delta * 60 * delta;
      pos[i * 3 + 2] += vel[i * 3 + 2] * delta * 60 * delta;
      vel[i * 3]     += (Math.random() - 0.5) * delta * 0.3;
      vel[i * 3 + 2] += (Math.random() - 0.5) * delta * 0.3;
      life[i] -= delta * 0.6;
      if (life[i] <= 0 || pos[i * 3 + 1] < -14) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.25;
        pos[i * 3]     = Math.cos(angle) * r;
        pos[i * 3 + 1] = -3.5 - Math.random();
        pos[i * 3 + 2] = Math.sin(angle) * r;
        vel[i * 3]     = (Math.random() - 0.5) * 0.15;
        vel[i * 3 + 1] = -(0.8 + Math.random() * 1.5);
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
        life[i]        = 0.8 + Math.random() * 0.4;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        color={COLORS.muted}
        transparent
        opacity={0.18}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------------- LAYERED FLAME ---------------------- */

function RocketFlame({ flameRef, isMobile }: { flameRef: React.RefObject<Group | null>; isMobile: boolean }) {
  const innerRef  = useRef<Mesh>(null);
  const midRef    = useRef<Mesh>(null);
  const outerRef  = useRef<Mesh>(null);
  const glowRef   = useRef<Mesh>(null);
  const shockRef  = useRef<Mesh>(null);
  const frameSkip = useRef(0);

  const segments = isMobile ? 16 : 32;

  useFrame((state) => {
    // Skip frames on mobile for better performance
    if (isMobile) {
      frameSkip.current++;
      if (frameSkip.current % 2 !== 0) return;
    }

    const t = state.clock.elapsedTime;
    // Simplified flicker on mobile
    const flicker = isMobile 
      ? 1 + Math.sin(t * 24) * 0.08
      : 1 + Math.sin(t * 48) * 0.07 + Math.sin(t * 27) * 0.04 + Math.sin(t * 13) * 0.03;
    const sway     = Math.sin(t * 11) * 0.025;
    const sway2    = Math.cos(t * 7)  * 0.015;

    if (flameRef.current) {
      flameRef.current.scale.set(0.97 + flicker * 0.04, flicker, 0.97 + flicker * 0.04);
      flameRef.current.position.x = sway;
      flameRef.current.position.z = sway2;
    }
    if (innerRef.current)  (innerRef.current.material  as THREE.MeshBasicMaterial).opacity = 0.94 + Math.sin(t * 30) * 0.05;
    if (midRef.current)    (midRef.current.material    as THREE.MeshBasicMaterial).opacity = 0.68 + Math.sin(t * 20) * 0.10;
    if (outerRef.current)  (outerRef.current.material  as THREE.MeshBasicMaterial).opacity = 0.28 + Math.sin(t * 12) * 0.08;
    if (glowRef.current)   (glowRef.current.material   as THREE.MeshBasicMaterial).opacity = 0.10 + Math.sin(t * 10) * 0.04;
    // Mach shock disc flicker
    if (shockRef.current)  {
      const s = 0.85 + Math.sin(t * 14) * 0.1;
      shockRef.current.scale.set(s, 1, s);
      (shockRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 12) * 0.15;
    }
  });

  return (
    <group ref={flameRef} position={[0, -5.1, 0]}>
      {/* Wide volumetric glow halo - skip on mobile */}
      {!isMobile && (
        <mesh ref={glowRef} scale={[1, 1.05, 1]}>
          <coneGeometry args={[1.4, 7.5, segments]} />
          <meshBasicMaterial color={COLORS.primary} transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {/* Outer flame - cool blue */}
      <mesh ref={outerRef} scale={[1, 1.02, 1]}>
        <coneGeometry args={[0.85, 6.2, segments]} />
        <meshBasicMaterial color="#4b9eff" transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Mid flame - blue-white */}
      <mesh ref={midRef}>
        <coneGeometry args={[0.52, 4.8, segments]} />
        <meshBasicMaterial color="#9ecfff" transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Inner core - near-white hot */}
      <mesh ref={innerRef}>
        <coneGeometry args={[0.24, 3.2, isMobile ? 12 : 24]} />
        <meshBasicMaterial color="#ddf0ff" transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Mach shock disc at nozzle exit - skip on mobile */}
      {!isMobile && (
        <mesh ref={shockRef} position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.65, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Lighting - reduced on mobile */}
      <pointLight color="#7BBBFF" intensity={isMobile ? 8 : 12} distance={30} decay={2} />
      {!isMobile && <pointLight color="#ddf0ff" intensity={6} distance={14} decay={2} />}
      {!isMobile && <pointLight color="#4b9eff" intensity={3} distance={50} decay={2} position={[0, -4, 0]} />}

      <ExhaustParticles isMobile={isMobile} />
    </group>
  );
}

/* ---------------------- PANEL DETAIL STRIPE ---------------------- */

function PanelStripe({ y, color, emissive, opacity = 1, isMobile = false }: { y: number; color: string; emissive?: string; opacity?: number; isMobile?: boolean }) {
  return (
    <mesh position={[0, y, 0]}>
      <cylinderGeometry args={[0.585, 0.585, 0.06, isMobile ? 24 : 64, 1, true]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.2}
        emissive={emissive ?? color}
        emissiveIntensity={emissive ? 0.25 : 0}
        transparent={opacity < 1}
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ---------------------- WINDOW PORTHOLE ---------------------- */

function Porthole({ angle, y, isMobile = false }: { angle: number; y: number; isMobile?: boolean }) {
  const r = 0.585;
  const segments = isMobile ? 16 : 32;
  return (
    <group position={[Math.cos(angle) * r, y, Math.sin(angle) * r]} rotation={[0, -angle + Math.PI / 2, 0]}>
      {/* Outer ring */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.04, segments, 1, true]} />
        <meshStandardMaterial color="#c8d8e8" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.08, segments]} />
        <meshStandardMaterial color="#a0d0ff" metalness={0.1} roughness={0} transparent opacity={0.75} envMapIntensity={2} />
      </mesh>
    </group>
  );
}

/* ---------------------- REALISTIC ROCKET ---------------------- */

function Rocket({ isMobile }: { isMobile: boolean }) {
  const groupRef  = useRef<Group>(null);
  const flameRef  = useRef<Group>(null);
  const progress  = useRef(0);
  const frameSkip = useRef(0);

  const START_Y  = -22;
  const END_Y    = 22;
  const DURATION = 7; // seconds per full pass
  
  // Reduced geometry segments for mobile
  const highSeg = isMobile ? 32 : 80;
  const midSeg = isMobile ? 24 : 64;
  const lowSeg = isMobile ? 16 : 32;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Skip every other frame on mobile for smoother performance
    if (isMobile) {
      frameSkip.current++;
      if (frameSkip.current % 2 !== 0) return;
    }
    
    progress.current += delta / DURATION;
    if (progress.current > 1) progress.current = 0;

    // Ease-in at launch, linear cruise, ease-out at top
    const t = progress.current;
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    groupRef.current.position.y = START_Y + eased * (END_Y - START_Y);
    groupRef.current.rotation.y += delta * (isMobile ? 0.08 : 0.12);
    if (!isMobile) {
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    }
  });

  const metalWhite: THREE.MeshStandardMaterialParameters = {
    color: "#EDF5FF",
    metalness: 0.55,
    roughness: 0.22,
    envMapIntensity: 1.4,
  };

  const metalDark: THREE.MeshStandardMaterialParameters = {
    color: "#B8CCD8",
    metalness: 0.80,
    roughness: 0.20,
    envMapIntensity: 1.2,
  };

  return (
    <group ref={groupRef}>
      {/* ── NOSE CONE (ogive profile via lathe) ─────────────── */}
      <mesh position={[0, 5.9, 0]}>
        <coneGeometry args={[0.52, 2.6, highSeg]} />
        <meshStandardMaterial {...metalWhite} />
      </mesh>
      {/* Nose tip cap */}
      <mesh position={[0, 7.2, 0]}>
        <sphereGeometry args={[0.08, lowSeg, lowSeg, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#D0E8FF" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ── INTERSTAGE COLLAR (nose ↔ upper body) ────────────── */}
      <mesh position={[0, 4.7, 0]}>
        <cylinderGeometry args={[0.56, 0.58, 0.25, midSeg]} />
        <meshStandardMaterial {...metalDark} />
      </mesh>
      {/* Riveted ring detail */}
      <PanelStripe y={4.58} color="#8ab4cc" isMobile={isMobile} />
      <PanelStripe y={4.82} color="#8ab4cc" isMobile={isMobile} />

      {/* ── UPPER BODY ──────────────────────────────────────── */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 4.1, highSeg]} />
        <meshStandardMaterial {...metalWhite} />
      </mesh>
      {/* Logo band stripe */}
      <PanelStripe y={2.8} color={COLORS.primary} emissive={COLORS.primary} isMobile={isMobile} />
      <PanelStripe y={2.6} color={COLORS.primary} emissive={COLORS.primary} isMobile={isMobile} />
      <PanelStripe y={1.4} color={COLORS.accent} emissive={COLORS.accent} isMobile={isMobile} />

      {/* Portholes - reduced on mobile */}
      {(isMobile ? [0, Math.PI] : [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]).map((a, i) => (
        <Porthole key={i} angle={a} y={2.2} isMobile={isMobile} />
      ))}

      {/* Panel detail lines (longitudinal seams) - skip on mobile */}
      {!isMobile && [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.582, 2.5, Math.sin(angle) * 0.582]} rotation={[0, -angle, 0]}>
          <boxGeometry args={[0.008, 3.9, 0.005]} />
          <meshStandardMaterial color="#a0b8cc" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* ── MID INTERSTAGE ──────────────────────────────────── */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.60, 0.62, 0.35, midSeg]} />
        <meshStandardMaterial {...metalDark} />
      </mesh>
      <PanelStripe y={0.17} color="#7a9ab0" isMobile={isMobile} />
      <PanelStripe y={0.53} color="#7a9ab0" isMobile={isMobile} />

      {/* ── LOWER BODY (fuel tank section) ──────────────────── */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.62, 0.64, 3.4, 80]} />
        <meshStandardMaterial color="#E0EDF8" metalness={0.55} roughness={0.25} />
      </mesh>
      {/* Weld lines / tank rings */}
      <PanelStripe y={-0.1}  color="#8ab0c4" />
      <PanelStripe y={-1.6}  color="#8ab0c4" />
      <PanelStripe y={-3.1}  color="#8ab0c4" />

      {/* Small thrust vector control actuator bumps */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.64, -0.6, Math.sin(angle) * 0.64]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#a8b8c8" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* ── ENGINE SECTION ──────────────────────────────────── */}
      <mesh position={[0, -3.45, 0]}>
        <cylinderGeometry args={[0.64, 0.66, 0.18, 64]} />
        <meshStandardMaterial {...metalDark} />
      </mesh>

      {/* Engine bay frame */}
      <mesh position={[0, -3.7, 0]}>
        <cylinderGeometry args={[0.58, 0.64, 0.45, 64]} />
        <meshStandardMaterial color="#8090a0" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Nozzle throat */}
      <mesh position={[0, -4.05, 0]}>
        <cylinderGeometry args={[0.36, 0.5, 0.5, 64]} />
        <meshStandardMaterial color="#6a7e8e" metalness={0.90} roughness={0.25} />
      </mesh>

      {/* Nozzle bell expansion */}
      <mesh position={[0, -4.6, 0]}>
        <cylinderGeometry args={[0.46, 0.36, 0.8, 64]} />
        <meshStandardMaterial color="#788898" metalness={0.88} roughness={0.22} />
      </mesh>

      {/* Nozzle exit lip */}
      <mesh position={[0, -5.05, 0]}>
        <torusGeometry args={[0.47, 0.025, 16, 80]} />
        <meshStandardMaterial color="#c0d0dc" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* ── FINS (4 × delta fins with leading edge) ─────────── */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          {/* Main fin panel */}
          <mesh position={[0.72, -2.5, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.55, 1.8, 0.06]} />
            <meshStandardMaterial color="#D0E0EE" metalness={0.55} roughness={0.3} />
          </mesh>
          {/* Fin leading edge bevel */}
          <mesh position={[0.92, -2.0, 0]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.38, 0.06, 0.06]} />
            <meshStandardMaterial color="#b0c4d4" metalness={0.7} roughness={0.25} />
          </mesh>
          {/* Fin tip fillet */}
          <mesh position={[0.72, -3.3, 0]}>
            <boxGeometry args={[0.4, 0.06, 0.06]} />
            <meshStandardMaterial color="#b0c4d4" metalness={0.7} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* ── LANDING LEGS (folded against body) ──────────────── */}
      {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          {/* Strut */}
          <mesh position={[0.55, -4.2, 0]} rotation={[0, 0, 0.35]}>
            <cylinderGeometry args={[0.025, 0.018, 1.3, 12]} />
            <meshStandardMaterial color="#7a8fa0" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Foot pad */}
          <mesh position={[0.88, -4.8, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#6a8090" metalness={0.75} roughness={0.35} />
          </mesh>
        </group>
      ))}

      <RocketFlame flameRef={flameRef} isMobile={isMobile} />
    </group>
  );
}

/* ---------------------- SCENE ---------------------- */

function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 12, 6]} intensity={2.2} castShadow={!isMobile} />
      {!isMobile && <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#a0c8ff" />}
      <Stars radius={220} depth={90} count={isMobile ? 1500 : 6000} factor={4.5} fade speed={0.5} />
      <Environment preset="night" />
      <Rocket isMobile={isMobile} />

      {/* Disable post-processing on mobile for better performance */}
      {!isMobile && (
        <EffectComposer>
          <Bloom intensity={1.8} luminanceThreshold={0.18} luminanceSmoothing={0.92} mipmapBlur />
          <ChromaticAberration offset={new Vector2(0.0008, 0.0008)} />
        </EffectComposer>
      )}
    </>
  );
}

/* ---------------------- HERO ---------------------- */

export function Hero3D() {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0">
      <Canvas 
        gl={{ 
          antialias: !isMobile, 
          toneMapping: THREE.ACESFilmicToneMapping, 
          toneMappingExposure: 1.1,
          powerPreference: isMobile ? "low-power" : "high-performance",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={50} />
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}