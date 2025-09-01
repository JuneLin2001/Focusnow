"use client";

import useSceneStore from "@/store/useSceneStore";
import usePageStore from "@/store/usePageStore";
import { useEffect } from "react";

const TimerPageInitializer = () => {
  const { setTargetPosition, setLookAtPosition } = useSceneStore();
  const { setPage } = usePageStore();

  useEffect(() => {
    setPage("timer");
    setTargetPosition([-50, 12, -150]);
    setLookAtPosition([0, 0, 0]);
  }, [setLookAtPosition, setPage, setTargetPosition]);

  return null;
};

export default TimerPageInitializer;
