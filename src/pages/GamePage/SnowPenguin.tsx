import { useState, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ModelProps } from "../../types/type";
import { Color, Mesh, MeshStandardMaterial } from "three";

const SnowPenguin: React.FC<ModelProps> = ({ children, onClick }) => {
  const { scene } = useGLTF("snowPenguin.glb");
  const [hovered, setHovered] = useState(false);
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
              material.color.set(
                hovered
                  ? originalColors.current
                      .get(mesh)!
                      .clone()
                      .multiplyScalar(0.3)
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
  }, [scene, hovered]);

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

export default SnowPenguin;
