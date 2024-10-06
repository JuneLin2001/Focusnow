import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";

interface BubbleProps {
  position: [number, number, number];
  onClick: () => void;
  Icon: React.ComponentType;
  content: string;
}

const Bubble: React.FC<BubbleProps> = ({
  position,
  onClick,
  Icon,
  content,
}) => {
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
        {content}
      </Button>
    </Html>
  );
};

export default Bubble;
