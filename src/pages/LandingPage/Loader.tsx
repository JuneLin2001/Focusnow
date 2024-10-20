import { Html } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";

interface LoaderProps {
  progress: number;
}

const Loader: React.FC<LoaderProps> = ({ progress }) => {
  return (
    <Html center>
      <div className="fixed inset-0 flex items-center justify-center h-screen z-50 bg-black bg-opacity-75">
        <div className="w-full max-w-lg px-4">
          <p className="text-center text-white mb-4">Loading...</p>
          <Progress value={progress} />
        </div>
      </div>
    </Html>
  );
};

export default Loader;
