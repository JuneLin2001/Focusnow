import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  varying vec3 vPosition;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // 簡單的波浪效果
    modelPosition.y += sin(modelPosition.x * 0.5 + uTime * 0.5) * 0.2
                     + sin(modelPosition.z * 0.5 + uTime * 0.5) * 0.2;

    vPosition = modelPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColorShallow;
  uniform vec3 uColorDeep;
  varying vec3 vPosition;

  void main() {
    float depth = smoothstep(-5.0, -20.0, vPosition.y);
    vec3 color = mix(uColorShallow, uColorDeep, depth);
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface OceanProps {
  size?: number;
  subdivisions?: number;
  position?: [number, number, number];
}

const Ocean: React.FC<OceanProps> = ({
  size = 50,
  subdivisions = 10,
  position = [0, 0, 0],
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorShallow: { value: new THREE.Color("#58B8DE") },
      uColorDeep: { value: new THREE.Color("#00277A") },
    }),
    []
  );

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, subdivisions, subdivisions]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Ocean;
