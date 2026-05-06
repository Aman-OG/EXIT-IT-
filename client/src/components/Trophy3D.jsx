import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Environment, ContactShadows } from '@react-three/drei';

const Crystal = ({ color }) => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const time = timeRef.current;
    
    meshRef.current.rotation.y += delta * 0.5;
    if (hovered) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.scale.lerp({ x: 1.2, y: 1.2, z: 1.2 }, 0.1);
    } else {
      meshRef.current.rotation.x = Math.sin(time) * 0.2;
      meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
    }
  });

  // Base colors mapped to theme
  let mainColor = '#f59e0b'; // amber
  if (color === 'purple') mainColor = '#a855f7';
  if (color === 'emerald') mainColor = '#10b981';

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
    >
      <octahedronGeometry args={[1.5, 0]} />
      <meshPhysicalMaterial 
        color={mainColor} 
        emissive={mainColor}
        emissiveIntensity={hovered ? 0.8 : 0.2}
        roughness={0.1}
        metalness={0.8}
        clearcoat={1}
        transmission={0.5}
        thickness={0.5}
      />
    </mesh>
  );
};

export const Trophy3D = ({ color = 'amber', size = '200px' }) => {
  return (
    <div style={{ width: size, height: size, margin: '0 auto', touchAction: 'none' }}>
      <Canvas shadows={{ type: 1 }} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Environment preset="city" />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Crystal color={color} />
        </Float>
        
        <Sparkles count={50} scale={4} size={2} speed={0.4} opacity={0.5} color="#ffffff" />
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={5} blur={2} far={4} />
        
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 2 - 0.5} />
      </Canvas>
    </div>
  );
};

export default Trophy3D;
