// CameraController.tsx
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls } from "@react-three/drei";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  initialPosition?: [number, number, number]; // 可選的初始位置
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  initialPosition = [-500, 60, 50], // 預設初始位置
}) => {
  const { camera } = useThree();
  const currentPosition = useRef<[number, number, number]>(initialPosition);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // 設定相機初始位置
      camera.position.set(...initialPosition);
      currentPosition.current = initialPosition; // 設定當前位置為初始位置
      isFirstRender.current = false;

      // 使用 gsap 平滑移動相機到目標位置
      gsap.to(camera.position, {
        x: -200, // 移動到最終位置
        y: 60,
        z: 50,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          camera.lookAt(
            targetPosition[0],
            targetPosition[1],
            targetPosition[2]
          );
        },
        onComplete: () => {
          // 當移動完成後，更新 currentPosition
          currentPosition.current = [-200, 60, 50];
        },
      });
    } else {
      gsap.to(camera.position, {
        x: targetPosition[0] + 2,
        y: targetPosition[1] + 2,
        z: targetPosition[2] + 4,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          // 更新 currentPosition
          currentPosition.current = [
            targetPosition[0] + 2,
            targetPosition[1] + 2,
            targetPosition[2] + 4,
          ];
        },
      });
    }
  }, [targetPosition, camera, initialPosition]);

  return <OrbitControls target={targetPosition} />;
};

export default CameraController;
