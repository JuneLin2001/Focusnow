"use client";

import useAuthStore from "@/store/authStore";
import { useState } from "react";
import { toast } from "react-toastify";

const useAnalyticsPageClick = () => {
  const { user } = useAuthStore();
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([-250, 60, 10]);
  const [lookAtPosition, setLookAtPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [page, setPage] = useState<
    "timer" | "analytics" | "game" | "Setting" | null
  >(null);

  const handleAnalyticsClick = () => {
    if (user) {
      setPage("analytics");
      setTargetPosition([-105, 25, 100]);
      setLookAtPosition([250, 0, 0]);
    } else {
      toast.error("尚未登入");
    }
  };

  return { handleAnalyticsClick };
};

export default useAnalyticsPageClick;
