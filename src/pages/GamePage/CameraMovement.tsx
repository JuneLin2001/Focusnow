import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  Float,
  ContactShadows,
  Environment,
  OrbitControls,
  Box,
  Stats,
} from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import LandingPage from "../LandingPage/index";
import AanalyticsPage from "../AnalyticsPage/AnalyticsPage";
import Ocean from "./Ocean";

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

// Bubble Component
interface BubbleProps {
  position: [number, number, number];
  onClick: () => void;
}

const Bubble: React.FC<BubbleProps> = ({ position, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  return (
    <Float
      position={position}
      speed={2}
      rotationIntensity={1}
      floatIntensity={1}
    >
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color={hovered ? "lightblue" : "blue"} />
      </mesh>
    </Float>
  );
};

// ThreeBox Component - Render multiple boxes
interface ThreeBoxProps {
  position: [number, number, number];
  onClick: () => void;
}

const ThreeBox: React.FC<ThreeBoxProps> = ({ position, onClick }) => {
  return (
    <Float
      position={position}
      speed={2}
      rotationIntensity={2}
      floatIntensity={2}
    >
      <Box>
        <meshPhysicalMaterial color="hotpink" />
        <Bubble position={[0, 1, 0]} onClick={onClick} />
      </Box>
    </Float>
  );
};

// CameraMovement Component
export default function CameraMovement() {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number] | null
  >(null);
  const [page, setPage] = useState<"landing" | "analytics" | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;

      // 設置初始鏡頭角度
      const initialCameraPosition = new THREE.Vector3(5, 5, 10); // 相機初始位置
      const initialCameraTarget = new THREE.Vector3(5, 5, 5); // 相機目標位置

      // 設置相機的位置和目標
      controls.object.position.copy(initialCameraPosition);
      controls.target.copy(initialCameraTarget);
      controls.update(); // 更新 OrbitControls 以應用變更
    }
  }, [controlsRef]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {page === "landing" && <LandingPage />}
      {page === "analytics" && <AanalyticsPage />}
      <Canvas>
        <Stats />

        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>
        <ThreeBox
          position={[-6, 2, 0]}
          onClick={() => {
            setTargetPosition([-6, 2, 0]);
            setPage("landing");
          }} // 點擊後顯示 LandingPage
        />
        <ThreeBox
          position={[0, 2, 6]}
          onClick={() => {
            setTargetPosition([0, 2, 6]);
            setPage("analytics");
          }} // 點擊後顯示 AnalyticsPage
        />
        <ThreeBox
          position={[6, 2, 0]}
          onClick={() => {
            setTargetPosition([6, 2, 0]);
            setPage("landing");
          }} // 點擊後顯示 LandingPage
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
    </div>
  );
}
