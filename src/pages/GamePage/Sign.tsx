import { useState, useEffect, useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { ModelProps } from "../../types/type";
import { Color, Mesh, MeshStandardMaterial } from "three";
import settingStore from "../../store/settingStore";
import { Card } from "@/components/ui/card";

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
    <>
      <group
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene} />
        {children}
      </group>
      {hovered && (
        <Html position={[75, 60, -20]} center>
          <Card className="w-36 h-10 flex justify-center items-center p-2">
            場景資訊
          </Card>
        </Html>
      )}
    </>
  );
};

export default Sign;
