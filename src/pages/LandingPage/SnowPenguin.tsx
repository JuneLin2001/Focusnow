import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ModelProps } from "../../types/type";
import { Color, Mesh, MeshStandardMaterial } from "three";
import settingStore from "../../store/settingStore";

const SnowPenguin: React.FC<
  ModelProps & {
    instructionHovered: boolean;
    setInstructionHovered: (value: boolean) => void;
  }
> = ({ children, onClick, instructionHovered, setInstructionHovered }) => {
  const { scene } = useGLTF("snowPenguin.glb");
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
            if (
              material instanceof MeshStandardMaterial ||
              material instanceof MeshStandardMaterial
            ) {
              if (!originalColors.current.has(mesh)) {
                originalColors.current.set(
                  mesh,
                  new Color(material.color.getHex())
                );
              }
              const brightnessMultiplier = themeMode === "dark" ? 10 : 0.3;

              material.color.set(
                instructionHovered
                  ? originalColors.current
                      .get(mesh)!
                      .clone()
                      .multiplyScalar(brightnessMultiplier)
                  : originalColors.current.get(mesh)!.clone()
              );
            }
          });
        }
      });

      document.body.style.cursor = instructionHovered ? "pointer" : "auto";
    }

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [scene, instructionHovered, themeMode]);

  return (
    <group
      onClick={onClick}
      onPointerOver={() => setInstructionHovered(true)}
      onPointerOut={() => setInstructionHovered(false)}
    >
      <primitive object={scene} />
      {children}
    </group>
  );
};

export default SnowPenguin;
