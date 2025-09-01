// import Joyride, { CallBackProps, EVENTS, Events, STATUS } from "react-joyride";
// import {useSettingStore} from "@/store/settingStore";
// import TimerInstructionSteps from "./TimerInstructionSteps";

// interface TimerInstructionProps {
//   handleCloseInstructions: () => void;
//   runTour: boolean;
//   setRunTour: (run: boolean) => void;
//   isSideBarOpen: boolean;
//   setIsSideBarOpen: (isOpen: boolean) => void;
// }

// const TimerInstruction: React.FC<TimerInstructionProps> = ({
//   handleCloseInstructions,
//   runTour,
//   setRunTour,
//   isSideBarOpen,
//   setIsSideBarOpen,
// }) => {
//   const { themeMode } = useSettingStore();

//   const handleJoyrideCallback = (data: CallBackProps) => {
//     const { index, status, type } = data;
//     if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
//       setRunTour(false);
//       handleCloseInstructions();
//     } else if (
//       ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)
//     ) {
//       if (index <= 2) {
//         setIsSideBarOpen(true);
//         setRunTour(true);
//       } else if (index >= 3) {
//         setTimeout(() => {
//           if (isSideBarOpen) {
//             setRunTour(true);
//             setIsSideBarOpen(false);
//           } else {
//             setRunTour(true);
//           }
//         }, 100);
//       } else {
//         setIsSideBarOpen(false);
//       }
//     }

//     if (type === EVENTS.STEP_BEFORE) {
//       if (index <= 3) {
//         setIsSideBarOpen(true);
//       }
//     }
//   };

//   return (
//     <Joyride
//       steps={TimerInstructionSteps()}
//       run={runTour}
//       continuous
//       showSkipButton
//       showProgress
//       callback={handleJoyrideCallback}
//       disableOverlayClose={true}
//       styles={{
//         options: {
//           arrowColor: "#e3ffeb",
//           primaryColor: themeMode === "light" ? "#3b82f6" : "#000",
//           zIndex: 1000,
//         },
//       }}
//       locale={{
//         back: "上一步",
//         last: "完成",
//         next: "下一步",
//         skip: "跳過",
//       }}
//     />
//   );
// };

// export default TimerInstruction;
