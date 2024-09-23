import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import gsap from "gsap";
import TimerPage from "../TimerPage/index";
import AnalyticsPage from "../AnalyticsPage";
import Ocean from "./Ocean";
import Mainland from "../../models/Mainland";
import Header from "./Header";
// import IceMountain from "./IceMountain";
import GamePage from "../GamePage/index";
import Igloo from "../../models/Igloo";
import FloatingIce from "../../models/floatingIce";
import Analytics from "../../models/AnalyticsCube";
import OceanModel from "../../models/OceanModel";

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

      // 添加隨機偏移量
      const randomOffsetX = Math.random() * 2 - 1; // -1 到 1 的隨機數
      const randomOffsetY = Math.random() * 2 - 1;
      const randomOffsetZ = Math.random() * 2 - 1;

      const finalTargetPosition = [
        targetPosition[0] + randomOffsetX,
        targetPosition[1] + randomOffsetY,
        targetPosition[2] + randomOffsetZ,
      ];

      // 使用 GSAP 對相機進行平滑過渡
      gsap.to(camera.position, {
        x: finalTargetPosition[0] + 2,
        y: finalTargetPosition[1] + 2,
        z: finalTargetPosition[2] + 4,
        duration: 1.5,
        ease: "power2.out", // 使用非線性插值
        onUpdate: () => {
          camera.lookAt(
            finalTargetPosition[0],
            finalTargetPosition[1],
            finalTargetPosition[2]
          );
        },
      });

      gsap.to(camera.rotation, {
        x: 0, // 設定x軸旋轉
        y: Math.PI, // 設定y軸旋轉（180度）
        z: 0, // 設定z軸旋轉
        duration: 1.5,
        ease: "power2.out",
      });

      // 控制目標的移動
      gsap.to(controls.target, {
        x: finalTargetPosition[0],
        y: finalTargetPosition[1],
        z: finalTargetPosition[2],
        duration: 1.5,
        ease: "power2.out", // 使用非線性插值
        onUpdate: () => controls.update(),
      });
    }
  }, [targetPosition, camera, controlsRef]);

  return null;
};

// CameraMovement Component
export default function LandingPage() {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number] | null
  >([0, 30, 0]); //TODO: 鏡頭初始位置

  const [page, setPage] = useState<"timer" | "analytics" | "game" | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <>
      <Header setPage={setPage} setTargetPosition={setTargetPosition} />{" "}
      {/* //TODO: Page的位置 */}
      {page === null ? (
        <div className="fixed z-10"></div>
      ) : (
        <div className="fixed z-10 bg-gray-100 opacity-80">
          {page === "timer" && <TimerPage />}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      )}
      <Canvas>
        <Stats />

        <Suspense fallback={null}>
          <Environment preset="warehouse" />
        </Suspense>

        <GamePage />
        <Mainland position={[-16, 2, 0]} />
        <Igloo
          position={[-114, 2, -16]}
          onClick={() => {
            setTargetPosition([0, 30, 0]);
            setTargetPosition([52, 35, 0]);
            setPage("timer");
          }}
        />
        <FloatingIce position={[0, 2, -30]} />
        <Analytics position={[0, 2, 0]} />

        <ContactShadows
          position={[0, -1.5, 0]}
          scale={10}
          blur={3}
          opacity={0.25}
          far={10}
        />

        {/* 使用 ref 獲取 OrbitControls 的實例 */}
        <OrbitControls ref={controlsRef} makeDefault enableZoom={true} />

        <CameraController
          targetPosition={targetPosition || [0, 0, 0]}
          controlsRef={controlsRef}
        />
        <OceanModel position={[0, 0, 0]} />
      </Canvas>
    </>
  );
}
