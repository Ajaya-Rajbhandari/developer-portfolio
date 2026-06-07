"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

function AccentMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.3, 180, 32]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#06b6d4"
        emissiveIntensity={0.25}
        metalness={0.4}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function HeroAccent() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-primary-accent/30 via-secondary-accent/20 to-transparent blur-2xl" />
    );
  }

  return (
    <Canvas
      shadows
      camera={{ position: [3, 2, 4], fov: 50 }}
      className="absolute inset-0 pointer-events-none"
    >
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.5} />
      <pointLight position={[-3, -2, -4]} intensity={0.8} color="#06b6d4" />
      <AccentMesh />
    </Canvas>
  );
}
