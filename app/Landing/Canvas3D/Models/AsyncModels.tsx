import { Environment, Sky } from "@react-three/drei";
import Snowflakes from "./Snowflakes";
import SnowPenguin from "@/components/Game/SnowPenguin";
import ShowInstructions from "../../Instructions/ShowInstructions";
import DropFish from "@/components/Game/DropFish";
import * as THREE from "three";
import {
  Mainland,
  FloatingIce,
  OceanModel,
  Igloo,
  AnalyticsCube,
} from "./StaticModels";
import usePageStore from "@/store/usePageStore";

interface AsyncModelsProps {
  fishesCount: number;
  fishPosition: THREE.Vector3 | null;
  handleDropFish: () => void;
  instructionHovered: boolean;
  handleShowInitialInstructions: () => void;
  setInstructionHovered: (value: boolean) => void;
  themeMode: "light" | "dark";
}

const AsyncModels: React.FC<AsyncModelsProps> = ({
  fishesCount,
  fishPosition,
  handleDropFish,
  instructionHovered,
  handleShowInitialInstructions,
  setInstructionHovered,
  themeMode,
}) => {
  const { page } = usePageStore();

  return (
    <>
      <Environment preset={themeMode === "light" ? "warehouse" : "night"} />
      {themeMode === "dark" && (
        <Sky sunPosition={[0, -1, 0]} distance={100000} />
      )}

      <Mainland />
      <Igloo />
      <FloatingIce />
      <OceanModel />
      <AnalyticsCube />
      <Snowflakes />

      <SnowPenguin
        instructionHovered={instructionHovered}
        onClick={handleShowInitialInstructions}
        setInstructionHovered={setInstructionHovered}
      />
      <ShowInstructions
        instructionHovered={instructionHovered}
        onClick={handleShowInitialInstructions}
        setInstructionHovered={setInstructionHovered}
      />

      {page === null && (
        <DropFish
          position={[100, 80, 0]}
          fishesCount={fishesCount}
          fishPosition={fishPosition}
          handleDropFish={handleDropFish}
        />
      )}
    </>
  );
};

export default AsyncModels;
