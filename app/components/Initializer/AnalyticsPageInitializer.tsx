"use client";

import useSceneStore from "@/store/useSceneStore";
import usePageStore from "@/store/usePageStore";
import { useEffect } from "react";

const AnalyticsPageInitializer = () => {
  const { setTargetPosition, setLookAtPosition } = useSceneStore();
  const { setPage } = usePageStore();

  useEffect(() => {
    setPage("analytics");
    setTargetPosition([-105, 25, 100]);
    setLookAtPosition([250, 0, 0]);
  }, [setLookAtPosition, setPage, setTargetPosition]);

  return null;
};

export default AnalyticsPageInitializer;
