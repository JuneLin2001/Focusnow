"use client";

import useSceneStore from "@/store/useSceneStore";
import { useEffect } from "react";

const AnalyticsPageInitializer = () => {
  const { setTargetPosition, setLookAtPosition } = useSceneStore();

  useEffect(() => {
    setTargetPosition([-105, 25, 100]);
    setLookAtPosition([250, 0, 0]);
  }, [setLookAtPosition, setTargetPosition]);

  return null;
};

export default AnalyticsPageInitializer;
