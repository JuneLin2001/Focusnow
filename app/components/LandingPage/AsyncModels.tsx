import { Environment, Sky } from "@react-three/drei";
import Snowflakes from "./Snowflakes";
import SnowPenguin from "../Game/SnowPenguin";
import ShowInstructions from "./ShowInstructions";
import DropFish from "../Game/DropFish";
import * as THREE from "three";
import {
  Mainland,
  FloatingIce,
  OceanModel,
  Igloo,
  AnalyticsCube,
} from "@/components/LandingPage/StaticModels";

interface AsyncModelsProps {
  page: "timer" | "analytics" | "game" | "Setting" | null;
  fishesCount: number;
  fishPosition: THREE.Vector3 | null;
  handleDropFish: () => void;
  isFishLoading: boolean;
  instructionHovered: boolean;
  handleShowInitialInstructions: () => void;
  setInstructionHovered: (value: boolean) => void;
  themeMode: "light" | "dark";
}

const AsyncModels: React.FC<AsyncModelsProps> = ({
  page,
  fishesCount,
  fishPosition,
  handleDropFish,
  isFishLoading,
  instructionHovered,
  handleShowInitialInstructions,
  setInstructionHovered,
  themeMode,
}) => {
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
          isFishLoading={isFishLoading}
        />
      )}
    </>
  );
};

export default AsyncModels;
