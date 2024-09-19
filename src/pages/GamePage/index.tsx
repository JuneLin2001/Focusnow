import MovingBox from "./MovingBox";
import Model from "./Model";
import MovingModel from "./MovingModel";

const GamePage = () => {
  const position: [number, number, number] = [0, 20, 0];

  const testPositions: [number, number, number][] = [
    [5, 30, 5],
    [-5, 30, -5],
    [10, 30, -10],
    [30, 30, -10],
    [20, 30, -10],
  ];

  // 手動設置 width、depth、speed 的默認值
  const width = 150;
  const depth = 200;
  // const speed = 2;

  // const minX = -width / 2;
  // const maxX = width / 2;
  // const minZ = -depth / 2;
  // const maxZ = depth / 2;

  // console.log(`${minX}, ${maxX}, ${minZ}, ${maxZ}, ${position[1]}`);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <boxGeometry args={[width, depth, 5]} />
        {<meshStandardMaterial color="aqua" wireframe />}
      </mesh>

      {/* <MovingBox
        position={position}
        minX={minX}
        maxX={maxX}
        minZ={minZ}
        maxZ={maxZ}
        speed={speed}
      /> */}

      {/* <MovingBox
        position={position}
        minX={minX}
        maxX={maxX}
        minZ={minZ}
        maxZ={maxZ}
        speed={speed}
      /> */}

      {/* <Model minX={minX} maxX={maxX} minZ={minZ} maxZ={maxZ} /> */}

      {testPositions.map((pos, index: number) => (
        <MovingModel
          key={index} // 為每個 MovingModel 提供唯一的 key
          id={index}
          position={pos}
          minX={-10 + index * 10}
          maxX={10 + index * 10}
          minZ={-10 + index * 10}
          maxZ={10 + index * 10}
          speed={2}
        />
      ))}
    </group>
  );
};

export default GamePage;
