"use client";

import { useState } from "react";
// import TimerInstruction from "./TimerInstruction";
// import { useSettingStore } from "@/store/settingStore";
import TimerCard from "./TimerCard";
import TodoList from "./TodoList";

const TimerPage = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  // const [runTour, setRunTour] = useState<boolean>(true);
  // const { hasSeenTimerInstruction } = useSettingStore();

  // useEffect(() => {
  //   if (!hasSeenTimerInstruction) {
  //     setRunTour(true);
  //   }
  // }, [hasSeenTimerInstruction]);

  // const handleCloseInstructions = async () => {
  // setRunTour(false);
  // useSettingStore.getState().setHasSeenTimerInstruction(true);
  // await useSettingStore.getState().saveUserSettings();
  // };

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <>
      {/* {runTour && (
        <TimerInstruction
          handleCloseInstructions={handleCloseInstructions}
          runTour={runTour}
          setRunTour={setRunTour}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )} */}
      <TimerCard isSideBarOpen={isSideBarOpen} />
      <TodoList isSideBarOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default TimerPage;
