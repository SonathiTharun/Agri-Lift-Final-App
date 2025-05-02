
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FieldGround: React.FC = () => {
  // Ground: gently bumpy mesh with green texture and some light patches
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(Date.now() * 0.00002) * 0.008;
    }
  });
  
  return (
    <mesh ref={meshRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 7, 20, 20]} />
      <meshStandardMaterial color="#96df71" roughness={0.7} />
    </mesh>
  );
};

export default FieldGround;
