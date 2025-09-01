"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  PresentationControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import { ModelProps } from "@/types/type";
import { useEffect, useRef } from "react";

export default function ErrorPage() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 25 }}
        className="touch-none"
      >
        <ambientLight intensity={0.5} />

        <PresentationControls
          global
          rotation={[0, 1, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <BounceModel position={[1, -1, 0]} />
        </PresentationControls>
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.75}
          scale={10}
          blur={3}
          far={4}
        />
        <ambientLight intensity={0.5} />

        <Environment preset="city" />
      </Canvas>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-9xl">
        error❌
      </div>
    </>
  );
}

const BounceModel: React.FC<ModelProps> = ({ onClick, ...props }) => {
  const gltf = useLoader(GLTFLoader, "defaultPwihMove.glb");
  const modelRef = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        const action = mixer.current!.clipAction(clip);
        action.play();
      });
    }
  }, [gltf]);

  useFrame((_state, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group {...props} onClick={onClick} dispose={null} ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  );
};
