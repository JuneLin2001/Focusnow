import { Environment, Sky } from "@react-three/drei";
import Mainland from "../../models/Mainland";
import Igloo from "../../models/Igloo";
import FloatingIce from "../../models/FloatingIce";
import OceanModel from "../../models/OceanModel";
import Analytics from "../../models/AnalyticsCube";
import Snowflakes from "./Snowflakes";
import SnowPenguin from "./SnowPenguin";
import ShowInstructions from "./ShowInstructions";
import DropFish from "./DropFish";
import * as THREE from "three";

interface AsyncModelsProps {
  page: "timer" | "analytics" | "game" | "Setting" | null;
  fishesCount: number;
  fishPosition: THREE.Vector3 | null;
  handleDropFish: () => void;
  isFishLoading: boolean;
  instructionHovered: boolean;
  handleShowInnitialInstructions: () => void;
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
  handleShowInnitialInstructions,
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
      <Analytics />
      <Snowflakes />

      <SnowPenguin
        instructionHovered={instructionHovered}
        onClick={handleShowInnitialInstructions}
        setInstructionHovered={setInstructionHovered}
      />
      <ShowInstructions
        instructionHovered={instructionHovered}
        onClick={handleShowInnitialInstructions}
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
