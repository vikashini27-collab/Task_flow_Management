import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Float, Sparkles, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

const RunningClouds = () => {
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (g1.current) { g1.current.position.x = Math.sin(t * 0.06) * 4; g1.current.position.y = Math.cos(t * 0.04) * 0.5; }
    if (g2.current) { g2.current.position.x = Math.cos(t * 0.05) * 3; g2.current.position.y = Math.sin(t * 0.03) * 0.7; }
  });
  return (<>
    <group ref={g1}>
      <Cloud position={[-3, 2, -8]} speed={0.4} opacity={0.7} color="#fce7f3" segments={20} />
      <Cloud position={[2, -1, -10]} speed={0.3} opacity={0.5} color="#e0e7ff" segments={15} />
      <Cloud position={[-5, 0, -12]} speed={0.2} opacity={0.6} color="#ffffff" segments={18} />
    </group>
    <group ref={g2}>
      <Cloud position={[4, 3, -9]} speed={0.3} opacity={0.5} color="#fce7f3" segments={16} />
      <Cloud position={[-2, -2, -11]} speed={0.2} opacity={0.4} color="#dbeafe" segments={14} />
      <Cloud position={[6, 1, -13]} speed={0.15} opacity={0.4} color="#ede9fe" segments={12} />
    </group>
  </>);
};

const CuteMoon = () => (
  <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
    <Sphere args={[1.2, 64, 64]} position={[4, 3, -6]}>
      <MeshDistortMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={0.6} distort={0.08} speed={1.5} roughness={0.3} />
    </Sphere>
  </Float>
);

const FallingLeaves = () => {
  const ref = useRef<THREE.Points>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.05; });
  return <Sparkles ref={ref} count={80} scale={14} size={4} speed={0.3} opacity={0.4} color="#f9a8d4" />;
};

export const DashboardBackground = ({ isLight }: { isLight: boolean }) => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" style={{ opacity: 0.5 }}>
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fff5f5" />
      {!isLight && <Stars radius={80} depth={50} count={1500} factor={3} saturation={0} fade speed={0.8} />}
      <CuteMoon />
      <RunningClouds />
      <FallingLeaves />
    </Canvas>
  </div>
);
