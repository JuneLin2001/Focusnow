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
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      camera.position.set(...initialPosition);
      isFirstRender.current = false;

      // TODO:使用 gsap 平滑移動相機到目標位置
      gsap.to(camera.position, {
        x: -100,
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
      });
    } else {
      gsap.to(camera.position, {
        x: targetPosition[0] + 2,
        y: targetPosition[1] + 2,
        z: targetPosition[2] + 4,
        duration: 2,
        ease: "power2.out",
      });
    }
  }, [targetPosition, camera, initialPosition]);

  return <OrbitControls target={targetPosition} />;
};

export default CameraController;
