import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls } from "@react-three/drei";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  lookAtPosition?: [number, number, number]; // 新增的 lookAtPosition 參數
  initialPosition?: [number, number, number]; // 可選的初始位置
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  lookAtPosition = targetPosition,
  initialPosition = [-500, 60, 50],
}) => {
  const { camera } = useThree();
  const currentPosition = useRef<[number, number, number]>(initialPosition);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      camera.position.set(...initialPosition);
      currentPosition.current = initialPosition;
      isFirstRender.current = false;

      gsap.to(camera.position, {
        x: -200,
        y: 60,
        z: 50,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          camera.lookAt(-200, 60, 50);
          console.log(lookAtPosition);
        },
        onComplete: () => {
          // 當移動完成後，更新 currentPosition
          currentPosition.current = [-200, 60, 50];
          camera.lookAt(
            lookAtPosition[0],
            lookAtPosition[1],
            lookAtPosition[2]
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
        onUpdate: () => {
          camera.lookAt(
            lookAtPosition[0], // 相機看向 lookAtPosition
            lookAtPosition[1],
            lookAtPosition[2]
          );
        },
        onComplete: () => {
          // 更新 currentPosition
          currentPosition.current = [
            targetPosition[0] + 2,
            targetPosition[1] + 2,
            targetPosition[2] + 4,
          ];
          camera.lookAt(
            lookAtPosition[0],
            lookAtPosition[1],
            lookAtPosition[2]
          ); // 移動結束時再確保看向 lookAtPosition
        },
      });
    }
  }, [targetPosition, lookAtPosition, camera, initialPosition]);

  return <OrbitControls target={lookAtPosition} />; // OrbitControls 也要更新成看向 lookAtPosition
};

export default CameraController;
