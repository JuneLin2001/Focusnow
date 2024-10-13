import { Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface DropFishProps {
  position: [number, number, number];
  onClick: () => void;
}

const DropFish: React.FC<DropFishProps> = ({ position, onClick }) => {
  return (
    <Html position={position} center>
      <Button variant="header" onClick={onClick}>
        <Lightbulb className="w-8 h-8 text-yellow-400 dark:text-white" />
      </Button>
    </Html>
  );
};

export default DropFish;
