
import React from 'react';

const FieldDecorations: React.FC = () => {
  return (
    <>
      {/* Soil color border */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[10.8, 7.7]} />
        <meshStandardMaterial color="#e3ce97" roughness={0.95} />
      </mesh>
      
      {/* Blue water channel */}
      <mesh position={[0, 0.05, 1.6]}>
        <boxGeometry args={[7, 0.09, 0.22]} />
        <meshStandardMaterial color="#33C3F0" transparent opacity={0.62} />
      </mesh>
      
      {/* Yellow fertilizer ring */}
      <mesh position={[-2, 0.06, -1.2]} rotation={[-Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.6, 0.07, 12, 32]} />
        <meshStandardMaterial color="#FFF07F" transparent opacity={0.72} />
      </mesh>
    </>
  );
};

export default FieldDecorations;
