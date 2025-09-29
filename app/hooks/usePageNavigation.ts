"use client";

import useSceneStore from "@/store/useSceneStore";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const usePageNavigation = () => {
  const { user } = useAuthStore();
  const { setTargetPosition, setLookAtPosition } = useSceneStore();
  const router = useRouter();

  const handleRootPageClick = () => {
    router.push("/");
    setTargetPosition([-250, 60, 10]);
    setLookAtPosition([0, 0, 0]);
  };

  const handleTimerPageClick = () => {
    router.push("/timer");
    setTargetPosition([-50, 12, -150]);
    setLookAtPosition([0, 0, 0]);
  };

  const handleAnalyticsClick = () => {
    if (user) {
      router.push("/analytics");
      setTargetPosition([-105, 25, 100]);
      setLookAtPosition([250, 0, 0]);
    } else {
      toast.error("尚未登入");
    }
  };

  return { handleRootPageClick, handleTimerPageClick, handleAnalyticsClick };
};

export default usePageNavigation;
