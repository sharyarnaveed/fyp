"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, Stars } from "@react-three/drei";



function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#7BBFFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#B8A9FF" />
      
      {/* Abstract Educational Objects */}
      {/* "Book" - Box */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-2.5, 1, 0]} scale={1.2}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#7BBFFF" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      
      {/* "Global Knowledge" - Sphere */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[2.5, -1, -1]} scale={0.8}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#B8A9FF" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      
      {/* "Focus" - Torus */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[0, 2, -2]} scale={0.6}>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <meshStandardMaterial color="#F2FDFF" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      
      {/* "Direction" - Cone/Pyramid */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[1.5, 1.5, 1]} scale={0.7}>
          <coneGeometry args={[1, 2, 32]} />
          <meshStandardMaterial color="#7BBFFF" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />
    </>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <Scene />
      </Canvas>
    </div>
  );
}
