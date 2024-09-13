import React, { useState, useEffect } from "react";

const LandingPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 初始時間設為 25 分鐘（以秒為單位）
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); // 當時間到達 0 時停止計時器
    }

    return () => clearInterval(timer); // 清除計時器
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(25 * 60); // 重置時間為 25 分鐘
  };

  const minusFiveMinute = () => {
    if (timeLeft >= 300) {
      setTimeLeft((prevTime) => prevTime - 300);
    } else if (timeLeft >= 30) {
      setTimeLeft((prevTime) => prevTime - 30);
    } else if (timeLeft >= 3) {
      setTimeLeft((prevTime) => prevTime - 3);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 h-96 border-4 border-black rounded-full flex flex-col justify-center items-center">
        <p className="text-[96px]">{formatTime(timeLeft)}</p>
        {isActive ? (
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 mt-4 block rounded"
          >
            Reset
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="bg-black text-white px-4 py-2 mt-4 block rounded"
          >
            Start
          </button>
        )}
        <button
          onClick={minusFiveMinute}
          className="bg-black text-white px-4 py-2 mt-4 block rounded"
        >
          minusTime
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
