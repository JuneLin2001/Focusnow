// App.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";

const App: React.FC = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]}>
          <meshStandardMaterial attach="material" color="orange" />
        </Box>
      </Canvas>
    </div>
  );
};

export default App;
