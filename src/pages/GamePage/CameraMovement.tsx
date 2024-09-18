import { Canvas, useThree } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  OrbitControls,
  Box,
} from "@react-three/drei";
import { Suspense, useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Ocean from "./Ocean";
import { Stats } from "@react-three/drei";

// CameraController Component
interface CameraControllerProps {
  targetPosition: [number, number, number];
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  controlsRef,
}) => {
  const { camera } = useThree();

  useEffect(() => {
    if (targetPosition && controlsRef.current) {
      const controls = controlsRef.current;

      // 使用 GSAP 對相機進行平滑過渡
      gsap.to(camera.position, {
        x: targetPosition[0] + 2,
        y: targetPosition[1] + 2,
        z: targetPosition[2] + 4,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => {
          camera.lookAt(
            targetPosition[0],
            targetPosition[1],
            targetPosition[2]
          );
        },
      });

      // 控制目標的移動
      gsap.to(controls.target, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => controls.update(),
      });
    }
  }, [targetPosition, camera, controlsRef]);

  return null;
};

// ThreeBox Component - Render multiple boxes
interface ThreeBoxProps {
  position: [number, number, number];
  onClick: () => void;
}

function ThreeBox({ position, onClick }: ThreeBoxProps) {
  return (
    <Float
      position={position}
      speed={2}
      rotationIntensity={2}
      floatIntensity={2}
    >
      <Box onClick={onClick}>
        <meshPhysicalMaterial color="hotpink" />
      </Box>
    </Float>
  );
}

// CameraMovement Component
export default function CameraMovement() {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number] | null
  >(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <Canvas>
      <Stats />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>
      <ThreeBox
        position={[-6, 0, 0]}
        onClick={() => setTargetPosition([-6, 0, 0])}
      />
      <ThreeBox
        position={[0, 0, 0]}
        onClick={() => setTargetPosition([0, 0, 0])}
      />
      <ThreeBox
        position={[6, 0, 0]}
        onClick={() => setTargetPosition([6, 0, 0])}
      />
      <ContactShadows
        position={[0, -1.5, 0]}
        scale={10}
        blur={3}
        opacity={0.25}
        far={10}
      />

      {/* 使用 ref 獲取 OrbitControls 的實例 */}
      <OrbitControls ref={controlsRef} makeDefault />

      <CameraController
        targetPosition={targetPosition || [0, 0, 0]}
        controlsRef={controlsRef}
      />
      <Ocean />
    </Canvas>
  );
}
