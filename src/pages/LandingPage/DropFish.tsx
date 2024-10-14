import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { FishSymbol } from "lucide-react";
import * as THREE from "three";

interface DropFishProps {
  position: [number, number, number];
  fishesCount: number;
  fishPosition: THREE.Vector3 | null;
  handleDropFish: () => void;
}

const DropFish: React.FC<DropFishProps> = ({
  position,
  fishesCount,
  fishPosition,
  handleDropFish,
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
        disabled={fishPosition !== null}
      >
        <FishSymbol /> <div className="ml-2">{fishesCount}</div>
      </Button>
    </Html>
  );
};

export default DropFish;
