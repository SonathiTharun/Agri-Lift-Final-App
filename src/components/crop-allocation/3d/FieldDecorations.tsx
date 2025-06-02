
import React from 'react';

const FieldDecorations: React.FC = () => {
  return (
    <>
      {/* Field boundaries with wooden posts */}
      {[-5, 5].map((x, i) => (
        <mesh key={`post-x-${i}`} position={[x, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
      ))}
      
      {[-3.5, 3.5].map((z, i) => (
        <mesh key={`post-z-${i}`} position={[0, 0.5, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
      ))}
      
      {/* Irrigation channels */}
      <mesh position={[0, 0.02, 2.5]} receiveShadow>
        <boxGeometry args={[8, 0.05, 0.3]} />
        <meshStandardMaterial color="#4682B4" transparent opacity={0.8} />
      </mesh>
      
      <mesh position={[0, 0.02, -2.5]} receiveShadow>
        <boxGeometry args={[8, 0.05, 0.3]} />
        <meshStandardMaterial color="#4682B4" transparent opacity={0.8} />
      </mesh>
      
      {/* Field paths */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[0.5, 8]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, Math.PI/2]}>
        <planeGeometry args={[0.5, 10]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.8} />
      </mesh>
      
      {/* Farming equipment - tractor */}
      <group position={[4.5, 0.2, -3]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.4, 0.3]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        {/* Tractor wheels */}
        <mesh position={[-0.3, -0.15, 0.2]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
        <mesh position={[0.3, -0.15, 0.2]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
      </group>
    </>
  );
};

export default FieldDecorations;
