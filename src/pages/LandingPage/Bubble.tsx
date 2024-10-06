import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";

interface BubbleProps {
  position: [number, number, number];
  onClick: () => void;
  Icon: React.ComponentType;
}

const Bubble: React.FC<BubbleProps> = ({ position, onClick, Icon }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} center>
      <Button
        variant="default"
        color={hovered ? "primary" : "secondary"}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Icon />
      </Button>
    </Html>
  );
};

export default Bubble;
