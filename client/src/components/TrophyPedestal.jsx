import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const TrophyPedestal = ({ position, badge, isUnlocked, onClick }) => {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const mainColor = isUnlocked ? badge.colorCode : '#444444';
  const emissiveIntensity = isUnlocked ? (hovered ? 1.5 : 0.5) : 0;

  return (
    <group position={position} onClick={onClick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
      {/* Pedestal Base */}
      <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, 1, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>

      {/* Trophy Crystal */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial 
            color={mainColor} 
            emissive={mainColor}
            emissiveIntensity={emissiveIntensity}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1}
            transmission={isUnlocked ? 0.4 : 0.8}
            thickness={1}
            opacity={isUnlocked ? 1 : 0.3}
            transparent={!isUnlocked}
          />
        </mesh>
      </Float>

      {/* Glow Effect if unlocked */}
      {isUnlocked && (
        <pointLight 
          position={[0, 0, 0]} 
          intensity={hovered ? 2 : 1} 
          distance={5} 
          color={mainColor} 
        />
      )}

      {/* Badge Name Label */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color={isUnlocked ? "#ffffff" : "#666666"}
        anchorX="center"
        anchorY="middle"
      >
        {badge.name}
      </Text>

      {/* Hover Info */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black/80 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-2xl pointer-events-none animate-in fade-in zoom-in duration-200">
            <div className="text-primary mb-1">{isUnlocked ? 'Unlocked' : 'Locked'}</div>
            <div className="opacity-80">{badge.desc}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default TrophyPedestal;
