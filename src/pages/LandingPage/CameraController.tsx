import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls } from "@react-three/drei";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  lookAtPosition?: [number, number, number];
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  lookAtPosition = targetPosition,
}) => {
  const { camera } = useThree();

  useEffect(() => {
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
  }, [targetPosition, lookAtPosition, camera]);

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
