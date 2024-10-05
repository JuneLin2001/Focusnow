import React, { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei"; // 引入 Html 組件
import { AlarmClock } from "lucide-react";

interface BubbleProps {
  position: [number, number, number];
  onClick: () => void;
}

const Bubble: React.FC<BubbleProps> = ({ position, onClick }) => {
  const [hovered, setHovered] = useState(false); // 控制鼠標懸停狀態

  // 使用 useFrame 讓泡泡上下浮動
  useFrame(() => {
    if (hovered) {
      // 如果被懸停，調整位置以達到浮動效果
      position[1] = position[1] + Math.sin(Date.now() * 0.005) * 0.15; // 調整浮動幅度和速度
    }
  });

  return (
    <Html position={position} center>
      <div
        className={`flex justify-center items-center w-10 h-10 rounded-full ${hovered ? "bg-red-500" : "bg-blue-500"}`} // 使用條件樣式
        onClick={onClick} // 點擊事件
        onMouseEnter={() => setHovered(true)} // 懸停時
        onMouseLeave={() => setHovered(false)} // 離開時
      >
        <AlarmClock />
      </div>
    </Html>
  );
};

export default Bubble;
