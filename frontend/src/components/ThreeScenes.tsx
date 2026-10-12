import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[1, 1, 0]}>
        <mesh>
          <torusGeometry args={[0.5, 0.2, 16, 32]} />
          <meshStandardMaterial color="#6366f1" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={[-1, -0.5, 1]}>
        <mesh>
          <octahedronGeometry args={[0.6]} />
          <meshStandardMaterial color="#f97316" roughness={0.2} metalness={0.5} />
        </mesh>
      </Float>
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1} position={[0, 1.5, -1]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={1} />
        </mesh>
      </Float>
    </group>
  );
};

export const ThreeLoginScene = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
    <ambientLight intensity={0.5} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
    <FloatingShapes />
    <Environment preset="city" />
    <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
  </Canvas>
);

export const ThreeDashboardScene = () => (
  <Canvas camera={{ position: [0, 0, 4], fov: 40 }} alpha={true}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1} />
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
       <mesh rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#4f46e5" opacity={0.8} transparent />
       </mesh>
    </Float>
  </Canvas>
);
