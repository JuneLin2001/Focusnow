"use client";

import { ToastContainer } from "react-toastify";
import { useSettingStore } from "@/store/settingStore";

const ToastInitializer = () => {
  const { themeMode } = useSettingStore();

  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      closeOnClick
      draggable
      theme={themeMode === "light" ? "light" : "dark"}
    />
  );
};

export default ToastInitializer;
