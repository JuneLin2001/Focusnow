import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls } from "@react-three/drei";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  lookAtPosition?: [number, number, number];
  isCompleted: boolean;
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  lookAtPosition = targetPosition,
  isCompleted,
}) => {
  const { camera } = useThree();
  const [isFirstEntry, setIsFirstEntry] = useState(true);

  useEffect(() => {
    let duration = 2;
    if (isFirstEntry) {
      duration = 4;
    } else if (!isCompleted) {
      duration = 2;
    }

    gsap.to(camera.position, {
      x: targetPosition[0] + 2,
      y: targetPosition[1] + 2,
      z: targetPosition[2] + 4,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        camera.lookAt(...lookAtPosition);
      },
    });
  }, [isFirstEntry, isCompleted, targetPosition, lookAtPosition, camera]);

  useEffect(() => {
    if (isCompleted) {
      setIsFirstEntry(false);
    }
  }, [isCompleted]);

  return (
    <>
      <OrbitControls
        target={lookAtPosition}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={600}
        enableZoom={true}
        enablePan={false}
        makeDefault
      />
    </>
  );
};

export default CameraController;
