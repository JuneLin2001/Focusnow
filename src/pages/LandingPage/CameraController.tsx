import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls } from "@react-three/drei";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  lookAtPosition: [number, number, number];
  isCameraMoveEnabled: boolean; // 新增這個 props
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minDistance?: number;
  maxDistance?: number;
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  lookAtPosition,
  isCameraMoveEnabled, // 接收 props
  minPolarAngle = Math.PI / 4,
  maxPolarAngle = Math.PI / 2,
  minDistance = 2,
  maxDistance = 600,
}) => {
  const { camera } = useThree();
  const isFirstRender = useRef(true);
  camera.position.set(-1000, 100, 100);

  useEffect(() => {
    if (isFirstRender.current && isCameraMoveEnabled) {
      // 在這裡使用 gsap.delayedCall 方法
      gsap.delayedCall(0.1, () => {
        // 延遲兩秒
        gsap.to(camera.position, {
          x: targetPosition[0],
          y: targetPosition[1] + 100,
          z: targetPosition[2],
          duration: 3,
          ease: "power2.out",
          onComplete: () => {
            isFirstRender.current = false;
          },
        });
      });
    } else if (isCameraMoveEnabled) {
      // 判斷是否啟用鏡頭移動
      gsap.to(camera.position, {
        x: targetPosition[0] + 2,
        y: targetPosition[1] + 2,
        z: targetPosition[2] + 4,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          camera.lookAt(...lookAtPosition);
        },
      });
    }
  }, [targetPosition, lookAtPosition, camera, isCameraMoveEnabled]);

  return (
    <>
      <OrbitControls
        target={lookAtPosition}
        minPolarAngle={minPolarAngle}
        maxPolarAngle={maxPolarAngle}
        minDistance={minDistance}
        maxDistance={maxDistance}
        enableZoom={true}
        enablePan={false}
        makeDefault
      />
    </>
  );
};

export default CameraController;
