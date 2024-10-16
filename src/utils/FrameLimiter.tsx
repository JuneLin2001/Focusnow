import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface FrameLimiterProps {
  fps: number;
}

const FrameLimiter: React.FC<FrameLimiterProps> = ({ fps }) => {
  const time = useRef(performance.now());
  const frameTime = 1000 / fps;

  useFrame((state) => {
    const now = performance.now();

    // 跳過渲染，除非足夠的時間已經過去
    if (now - time.current >= frameTime) {
      time.current = now; // 更新上次渲染的時間
      state.gl.render(state.scene, state.camera); // 手動觸發渲染
    }
  }, 1); // 這裡的 "1" 表示每次都在優先級最高的幀上執行

  return null;
};

export default FrameLimiter;
