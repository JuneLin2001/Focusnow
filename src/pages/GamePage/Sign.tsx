import { useState, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ModelProps } from "../../types/type";
import { Color, Mesh, MeshStandardMaterial } from "three";
import settingStore from "../../store/settingStore";

const Sign: React.FC<ModelProps> = ({ children, onClick }) => {
  const { scene } = useGLTF("sign.glb");
  const [hovered, setHovered] = useState(false);
  const originalColors = useRef<Map<Mesh, Color>>(new Map());
  const { themeMode } = settingStore();

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
                hovered
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

      document.body.style.cursor = hovered ? "pointer" : "auto";
    }

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [scene, hovered, themeMode]);

  return (
    <group
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
      {children}
    </group>
  );
};

export default Sign;
