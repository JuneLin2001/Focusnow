"use client";

import useSceneStore from "@/store/useSceneStore";
import { useEffect } from "react";

const TimerPageInitializer = () => {
  const { setTargetPosition, setLookAtPosition } = useSceneStore();

  useEffect(() => {
    setTargetPosition([-50, 12, -150]);
    setLookAtPosition([0, 0, 0]);
  }, [setLookAtPosition, setTargetPosition]);

  return null;
};

export default TimerPageInitializer;
