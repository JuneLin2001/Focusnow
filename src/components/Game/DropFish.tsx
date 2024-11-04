import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { FishSymbol } from "lucide-react";
import * as THREE from "three";
import { Spinner } from "@/components/ui/spinner";

interface DropFishProps {
  position: [number, number, number];
  fishesCount: number;
  fishPosition: THREE.Vector3 | null;
  handleDropFish: () => void;
  isFishLoading: boolean;
}

const DropFish: React.FC<DropFishProps> = ({
  position,
  fishesCount,
  fishPosition,
  handleDropFish,
  isFishLoading,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} center>
      <Button
        variant="default"
        color={hovered ? "primary" : "secondary"}
        onClick={handleDropFish}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={fishPosition !== null || isFishLoading}
      >
        {isFishLoading ? (
          <>
            <FishSymbol />
            <div className="ml-2">
              <Spinner size="small" />
            </div>
          </>
        ) : (
          <>
            <FishSymbol /> <div className="ml-2">{fishesCount}</div>
          </>
        )}
      </Button>
    </Html>
  );
};

export default DropFish;
