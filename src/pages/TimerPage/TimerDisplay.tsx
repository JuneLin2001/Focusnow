import { useTimerStore } from "../../store/timerStore";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import settingStore from "../../store/settingStore";
import { Card } from "@/components/ui/card";

interface TimerDisplayProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ onClick }) => {
  const { secondsLeft, inputMinutes, breakMinutes, mode } = useTimerStore();
  const { themeMode } = settingStore();

  if (mode === "work" && secondsLeft >= inputMinutes * 60) {
    return null;
  }

  const percentage =
    mode === "work"
      ? (secondsLeft / (inputMinutes * 60)) * 100
      : (secondsLeft / (breakMinutes * 60)) * 100;

  const pathColor =
    mode === "work"
      ? themeMode === "dark"
        ? "#1e3a8a"
        : "#3b82f6"
      : themeMode === "dark"
        ? "#0b4f22"
        : "#009b00";

  return (
    <Card
      className="fixed bottom-40 right-6 p-4 bg-white opacity-80 z-10 w-36 cursor-pointer"
      onClick={onClick}
    >
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          textColor: "#000",
          pathColor: pathColor,
          trailColor: "#d6d6d6",
        })}
      >
        <div>
          <h3 className="text-xl">
            {Math.floor(secondsLeft / 60)}:
            {secondsLeft % 60 < 10
              ? "0" + (secondsLeft % 60)
              : secondsLeft % 60}
          </h3>
        </div>
      </CircularProgressbarWithChildren>
    </Card>
  );
};

export default TimerDisplay;
