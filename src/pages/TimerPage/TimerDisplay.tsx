import { useTimerStore } from "../../store/timerStore";

const TimerDisplay = () => {
  const { secondsLeft } = useTimerStore();

  return (
    <div className="fixed bottom-40 right-0 p-4 bg-white opacity-80 z-10">
      <h3>
        倒數時間: {Math.floor(secondsLeft / 60)}:
        {secondsLeft % 60 < 10 ? "0" + (secondsLeft % 60) : secondsLeft % 60}
      </h3>
    </div>
  );
};

export default TimerDisplay;
