import MovingBox from "./MovingBox";
import Model from "./Model";
import MovingModel from "./MovingModel";

const GamePage = () => {
  const position: [number, number, number] = [0, 20, 0];

  // 手動設置 width、depth、speed 的默認值
  const width = 150;
  const depth = 200;
  const speed = 2;

  const minX = -width / 2;
  const maxX = width / 2;
  const minZ = -depth / 2;
  const maxZ = depth / 2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <boxGeometry args={[width, depth, 5]} />
        {<meshStandardMaterial color="aqua" wireframe />}
      </mesh>

      <MovingBox
        position={position}
        minX={minX}
        maxX={maxX}
        minZ={minZ}
        maxZ={maxZ}
        speed={speed}
      />

      <MovingBox
        position={position}
        minX={minX}
        maxX={maxX}
        minZ={minZ}
        maxZ={maxZ}
        speed={speed}
      />

      <Model minX={minX} maxX={maxX} minZ={minZ} maxZ={maxZ} />

      <MovingModel
        position={position}
        minX={minX}
        maxX={maxX}
        minZ={minZ}
        maxZ={maxZ}
      />
    </group>
  );
};

export default GamePage;
