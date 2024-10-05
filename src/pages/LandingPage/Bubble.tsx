import React, { useState } from "react";
import { Html } from "@react-three/drei"; // 引入 Html 組件

interface BubbleProps {
  position: [number, number, number];
  onClick: () => void;
  Icon: React.ComponentType; // 接收一個 React 組件作為圖示
}

const Bubble: React.FC<BubbleProps> = ({ position, onClick, Icon }) => {
  const [hovered, setHovered] = useState(false); // 控制鼠標懸停狀態

  return (
    <Html position={position} center>
      <div
        className={`flex justify-center items-center w-10 h-10 rounded-full  ${hovered ? "bg-red-500" : "bg-blue-500"}`} // 使用條件樣式
        onClick={onClick} // 點擊事件
        onMouseEnter={() => setHovered(true)} // 懸停時
        onMouseLeave={() => setHovered(false)} // 離開時
      >
        <Icon /> {/* 渲染傳入的圖示 */}
      </div>
    </Html>
  );
};

export default Bubble;
