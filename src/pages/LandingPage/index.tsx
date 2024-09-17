import Timer from "./Timer";
import TodoList from "./TodoList.js";
import BackgroundModel from "./BackgroundModel";
import { Canvas } from "@react-three/fiber";

const LandingPage = () => {
  return (
    <div className="relative w-screen h-screen">
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        camera={{ position: [20, 2, 5], fov: 50 }} // 調整相機位置
      >
        <ambientLight intensity={5} /> {/* 環境光 */}
        <BackgroundModel />
      </Canvas>
      <div className="relative z-10">
        <Timer />
        <TodoList />
      </div>
    </div>
  );
};

export default LandingPage;
