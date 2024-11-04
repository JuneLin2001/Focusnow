import { useProgress } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";

const Loader = () => {
  const { progress } = useProgress();
  if (progress >= 100) {
    return null;
  }
  return (
    <>
      <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-75">
        <div className="w-full max-w-lg px-4">
          <p className="mb-4 text-center text-white">
            Loading... {Math.round(progress)}%
          </p>
          <Progress value={progress} />
        </div>
      </div>
    </>
  );
};

export default Loader;
