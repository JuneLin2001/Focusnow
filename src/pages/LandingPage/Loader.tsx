import { Html, useProgress } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";

const Loader = () => {
  const { progress, item } = useProgress();

  return (
    <Html center>
      <div className="fixed inset-0 flex items-center justify-center h-screen z-50 bg-black bg-opacity-75">
        <div className="w-full max-w-lg px-4">
          <p className="text-center text-white mb-4">
            Loading {Math.floor(progress)}% - {item}
          </p>
          <Progress value={progress} />
        </div>
      </div>
    </Html>
  );
};

export default Loader;
