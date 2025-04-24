import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ModelProps } from "../../types/type";
import { Float } from "@react-three/drei";
import { Color, Mesh, MeshStandardMaterial } from "three";
import settingStore from "../../store/settingStore";

const ShowInstructions: React.FC<
  ModelProps & {
    instructionHovered: boolean;
    setInstructionHovered: (value: boolean) => void;
  }
> = ({ children, onClick, instructionHovered, setInstructionHovered }) => {
  const { scene } = useGLTF("lightBulb.glb");
  const { themeMode } = settingStore();
  const originalColors = useRef<Map<Mesh, Color>>(new Map());

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        const mesh = child as Mesh;

        if (mesh.isMesh && mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

          materials.forEach((material) => {
            if (material instanceof MeshStandardMaterial) {
              if (!originalColors.current.has(mesh)) {
                originalColors.current.set(
                  mesh,
                  new Color(material.color.getHex()),
                );
              }

              const brightnessMultiplier = themeMode === "dark" ? 50 : 0.3;

              material.color.set(
                instructionHovered
                  ? originalColors.current
                      .get(mesh)!
                      .clone()
                      .multiplyScalar(brightnessMultiplier)
                  : originalColors.current
                      .get(mesh)!
                      .clone()
                      .multiplyScalar(10),
              );
            }
          });
        }
      });
    }

    document.body.style.cursor = instructionHovered ? "pointer" : "auto";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [scene, instructionHovered, themeMode]);

  return (
    <Float
      speed={10}
      rotationIntensity={0}
      floatIntensity={1}
      floatingRange={[0, 10]}
    >
      <group
        onClick={onClick}
        onPointerOver={() => setInstructionHovered(true)}
        onPointerOut={() => setInstructionHovered(false)}
      >
        <pointLight
          position={[115, 50, 145]}
          intensity={5000}
          distance={70}
          decay={2}
          color="yellow"
        />
        <primitive object={scene} />
        {children}
      </group>
    </Float>
  );
};

export default ShowInstructions;
