import React from "react";
import { Html } from "@react-three/drei";

interface ModelInstructionsProps {
  date: string;
  todoTitles: string[];
  onClose: () => void;
  position: [number, number, number]; // 用於顯示位置
  focusDuration: number; // 傳遞專注時間
}

const ModelInstructions: React.FC<ModelInstructionsProps> = ({
  date,
  todoTitles,
  onClose,
  position,
  focusDuration,
}) => {
  return (
    <Html fullscreen>
      <div
        style={{
          position: "absolute",
          left: `${position[0]}px`,
          top: `${position[1]}px`,
          transform: "translate(-50%, -100%)",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <h2>Focus Date: {date}</h2>
        <p>Focus Duration: {focusDuration} seconds</p>
        <ul>
          {todoTitles.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </Html>
  );
};

export default ModelInstructions;
