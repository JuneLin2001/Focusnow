import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { FishSymbol } from "lucide-react";

interface DropFishProps {
  position: [number, number, number];
  fishesCount: number;
  handleDropFish: () => void;
}

const DropFish: React.FC<DropFishProps> = ({
  position,
  fishesCount,
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
      >
        <FishSymbol /> {fishesCount}
      </Button>
    </Html>
  );
};

export default DropFish;
