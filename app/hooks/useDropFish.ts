"use client";

import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { useFishesCountStore } from "@/store/fishesCountStore";
import * as THREE from "three";
import { toast } from "react-toastify";

const useDropFish = () => {
  const { user } = useAuthStore();
  const { fishesCount, updateFishesCount } = useFishesCountStore();
  const [fishPosition, setFishPosition] = useState<THREE.Vector3 | null>(null);
  const [isFishLoading, setIsFishLoading] = useState(false);

  const handleDropFish = async () => {
    if (user) {
      if (fishesCount > 0) {
        const randomX = Math.random() * (175 - -15) + -15;
        const randomZ = Math.random() * (90 - -150) + -150;
        setFishPosition(new THREE.Vector3(randomX, -5.5, randomZ));
        setIsFishLoading(true);
        await updateFishesCount(-1);
        setIsFishLoading(false);
      } else {
        toast.warning("沒有魚可以放置了，每專注1分鐘可以獲得1條魚！");
      }
    } else {
      toast.error("尚未登入");
    }
  };

  return {
    handleDropFish,
  };
};

export default useDropFish;
