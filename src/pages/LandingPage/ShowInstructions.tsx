import { Html, Float } from "@react-three/drei";
import { Lightbulb, ArrowDown } from "lucide-react";

interface ShowInstructionsProps {
  position: [number, number, number];
}

const ShowInstructions: React.FC<ShowInstructionsProps> = ({ position }) => {
  return (
    <Float
      speed={10} // Animation speed, defaults to 1
      rotationIntensity={0} // XYZ rotation intensity set to 0 for no rotation
      floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange, defaults to 1
      floatingRange={[5, 10]} // Range of y-axis values the object will float within, this allows for Y-axis only floating
    >
      <Html position={position} center>
        <Lightbulb className="w-8 h-8 text-yellow-400 dark:text-white" />
        <ArrowDown className="w-8 h-8 text-yellow-400 dark:text-white" />
      </Html>
    </Float>
  );
};

export default ShowInstructions;
