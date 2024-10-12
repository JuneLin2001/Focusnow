import React, { useRef, useEffect, useCallback, useState } from "react";
import { useTimerStore } from "../../store/timerStore";
import settingStore from "../../store/settingStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TimerDisplayProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ onClick }) => {
  const { secondsLeft, inputMinutes, breakMinutes, mode } = useTimerStore();
  const { themeMode } = settingStore();
  const [isPipActive, setIsPipActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const drawOnCanvas = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 400, 400);

        ctx.fillStyle = themeMode === "dark" ? "#000" : "#fff";
        ctx.fillRect(0, 0, 400, 400);

        ctx.fillStyle = themeMode === "dark" ? "#fff" : "#000";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `${Math.floor(secondsLeft / 60)}:${
            secondsLeft % 60 < 10 ? "0" + (secondsLeft % 60) : secondsLeft % 60
          }`,
          200,
          200
        );

        ctx.beginPath();
        ctx.arc(200, 200, 180, 0, (Math.PI * 2 * percentage) / 100);
        ctx.strokeStyle = pathColor;
        ctx.lineWidth = 10;
        ctx.stroke();
      }
    }
  }, [themeMode, secondsLeft, percentage, pathColor]);

  const enterPiP = useCallback(async () => {
    if (!document.pictureInPictureEnabled || isPipActive) {
      return;
    }

    if (canvasRef.current && videoRef.current) {
      try {
        const stream = canvasRef.current.captureStream();
        videoRef.current.srcObject = stream;

        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve();
        });

        if (document.body.contains(videoRef.current)) {
          await videoRef.current.play();
          await videoRef.current.requestPictureInPicture();
          setIsPipActive(true);
        } else {
          throw new Error("Video element is not in the document");
        }
      } catch (error) {
        console.error("Error entering Picture-in-Picture mode", error);
      }
    }
  }, [isPipActive]);

  const exitPiP = useCallback(async () => {
    if (document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
        setIsPipActive(false);
      } catch (error) {
        console.error("Error exiting Picture-in-Picture mode", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        enterPiP();
      } else {
        exitPiP();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enterPiP, exitPiP]);

  useEffect(() => {
    const pipHandler = () => {
      setIsPipActive(!!document.pictureInPictureElement);
    };

    document.addEventListener("enterpictureinpicture", pipHandler);
    document.addEventListener("leavepictureinpicture", pipHandler);

    return () => {
      document.removeEventListener("enterpictureinpicture", pipHandler);
      document.removeEventListener("leavepictureinpicture", pipHandler);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateCanvas = () => {
      drawOnCanvas();
      animationFrameId = requestAnimationFrame(updateCanvas);
    };

    updateCanvas();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawOnCanvas]);

  return (
    <div>
      <Card
        className="fixed bottom-40 right-6 p-4 bg-white opacity-80 z-10 w-36 cursor-pointer"
        onClick={onClick}
      >
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          style={{ display: "none" }}
        />

        <div>
          <h3 className="text-xl">
            {Math.floor(secondsLeft / 60)}:
            {secondsLeft % 60 < 10
              ? "0" + (secondsLeft % 60)
              : secondsLeft % 60}
          </h3>
        </div>

        <video ref={videoRef} style={{ display: "none" }} muted playsInline />

        <div>
          {!isPipActive ? (
            <Button onClick={enterPiP}>Enter PiP</Button>
          ) : (
            <Button onClick={exitPiP}>Exit PiP</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TimerDisplay;
