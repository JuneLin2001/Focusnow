import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Snowflakes = () => {
  const particleNum = 5000;
  const maxRange = 1000;
  const minRange = maxRange / 2;
  const textureSize = 64.0;
  const particlesRef = useRef<THREE.Points | null>(null);

  // 創建雪花紋理
  const getTexture = (): THREE.Texture => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to get canvas context");
    }

    const diameter = textureSize;
    canvas.width = diameter;
    canvas.height = diameter;
    const canvasRadius = diameter / 2;

    const gradient = ctx.createRadialGradient(
      canvasRadius,
      canvasRadius,
      0,
      canvasRadius,
      canvasRadius,
      canvasRadius
    );
    gradient.addColorStop(0, "rgba(255,255,255,1.0)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // 使用 useMemo 確保材質僅在必要時創建
  const pointMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 8,
      color: 0xffffff,
      map: getTexture(),
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useEffect(() => {
    // 創建雪花粒子
    const createParticles = (): THREE.BufferGeometry => {
      const pointGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleNum * 3);
      const velocities = new Float32Array(particleNum * 3);

      for (let i = 0; i < particleNum; i++) {
        positions[i * 3] = Math.random() * maxRange - minRange; // x
        positions[i * 3 + 1] = Math.random() * maxRange - minRange; // y
        positions[i * 3 + 2] = Math.random() * maxRange - minRange; // z

        velocities[i * 3] = Math.random() * 0.2 - 0.1; // x velocity
        velocities[i * 3 + 1] = Math.random() * -0.2; // y velocity (downward)
        velocities[i * 3 + 2] = Math.random() * 0.2 - 0.1; // z velocity
      }

      pointGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      // 將 velocities 作為幾何體的擴展屬性
      pointGeometry.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3)
      );

      return pointGeometry;
    };

    // 創建粒子
    const particles = createParticles();
    particlesRef.current = new THREE.Points(particles, pointMaterial);

    return () => {
      particlesRef.current = null; // 清除參考
    };
  }, [minRange, pointMaterial]); // 依賴於 pointMaterial

  // 使用 useFrame 來實現動畫效果
  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const velocities = particlesRef.current.geometry.attributes.velocity
        .array as Float32Array; // 獲取 velocity 屬性

      for (let i = 0; i < particleNum; i++) {
        positions[i * 3 + 1] += velocities[i * 3 + 1]; // 垂直運動

        // 重新設定 y 位置
        if (positions[i * 3 + 1] < -minRange) {
          positions[i * 3 + 1] = minRange;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return particlesRef.current ? (
    <primitive object={particlesRef.current} />
  ) : null;
};

export default Snowflakes;
