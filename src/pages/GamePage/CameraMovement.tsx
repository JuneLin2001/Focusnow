import { Canvas, useThree } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  OrbitControls,
  Box,
} from "@react-three/drei";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useSpring, a, config } from "@react-spring/three";
import { Vector3 } from "three";

// 預設位置與目標
const t = new Vector3();

const defaultPosition = {
  position: [0, 0, 0] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
};

const farAway = {
  position: [5, 5, 10] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
};

// CameraWrapper Component
interface CameraWrapperProps {
  cameraPosition: [number, number, number];
  target: [number, number, number];
}

const CameraWrapper: React.FC<CameraWrapperProps> = ({
  cameraPosition,
  target,
}) => {
  const { camera } = useThree();
  camera.position.set(...cameraPosition);
  camera.lookAt(t.set(...target));
  return null;
};

// ControlsWrapper Component
interface ControlsWrapperProps {
  target: [number, number, number];
}

const ControlsWrapper: React.FC<ControlsWrapperProps> = ({ target }) => {
  const { controls } = useThree();
  if (controls) {
    controls.target.set(...target);
  }
  return null;
};

// 動畫效果控制器
interface AnimateEyeToTargetProps {
  position: [number, number, number];
  target: [number, number, number];
}

function AnimateEyeToTarget({ position, target }: AnimateEyeToTargetProps) {
  const { camera, controls } = useThree();

  const s = useSpring({
    from: defaultPosition,
    config: config.wobbly,
    onStart: () => {
      if (controls) controls.enabled = false;
    },
    onRest: () => {
      if (controls) controls.enabled = true;
    },
  });

  s.position.start({ from: camera.position.toArray(), to: position });
  s.target.start({
    from: controls ? controls.target.toArray() : [0, 0, 0],
    to: target,
  });

  const AnimateControls = useMemo(() => a(ControlsWrapper), []);
  const AnimatedNavigation = useMemo(() => a(CameraWrapper), []);

  return (
    <>
      <AnimatedNavigation
        cameraPosition={s.position as [number, number, number]}
        target={s.target as [number, number, number]}
      />
      <AnimateControls target={s.target as [number, number, number]} />
    </>
  );
}

// EyeAnimation Component
interface EyeAnimationProps {
  targetPosition: [number, number, number];
}

function EyeAnimation({ targetPosition }: EyeAnimationProps) {
  const [cameraSettings, setCameraSettings] = useState(farAway);

  useEffect(() => {
    if (targetPosition) {
      setCameraSettings({
        position: [
          targetPosition[0] + 2,
          targetPosition[1] + 2,
          targetPosition[2] + 4,
        ], // 近景
        target: targetPosition, // 鏡頭對準方塊
      });
    }
  }, [targetPosition]);

  return (
    <>
      <AnimateEyeToTarget
        position={cameraSettings.position}
        target={cameraSettings.target}
      />
    </>
  );
}

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

  return (
    <Canvas>
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>
      <ThreeBox
        position={[-5, 0, 0]}
        onClick={() => setTargetPosition([-5, 0, 0])}
      />
      <ThreeBox
        position={[0, 0, 0]}
        onClick={() => setTargetPosition([0, 0, 0])}
      />
      <ThreeBox
        position={[5, 0, 0]}
        onClick={() => setTargetPosition([5, 0, 0])}
      />
      <ContactShadows
        position={[0, -1.5, 0]}
        scale={10}
        blur={3}
        opacity={0.25}
        far={10}
      />
      <OrbitControls makeDefault />
      <EyeAnimation targetPosition={targetPosition || [0, 0, 0]} />
    </Canvas>
  );
}
