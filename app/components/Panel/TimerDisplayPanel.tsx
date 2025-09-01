"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTimerStore } from "@/store/timerStore";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSettingStore } from "@/store/settingStore";
import { Card } from "@/components/ui/card";
import usePageStore from "@/store/usePageStore";
import usePageNavigation from "@/hooks/usePageNavigation";

const TimerDisplayPanel = () => {
  const { page } = usePageStore();
  const { handleTimerPageClick } = usePageNavigation();
  const {
    secondsLeft,
    inputMinutes,
    breakMinutes,
    mode,
    rotationCount,
    setCanvasRef,
  } = useTimerStore();

  const { themeMode } = useSettingStore();
  const canvasRef = useRef<HTMLCanvasElement>(null!);
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

  const pipWindowWidth = 360;

  useEffect(() => {
    return setCanvasRef(canvasRef);
  }, [setCanvasRef]);

  const drawOnCanvas = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, pipWindowWidth, pipWindowWidth);

        ctx.fillStyle = themeMode === "dark" ? "#000" : "#fff";
        ctx.fillRect(0, 0, pipWindowWidth, pipWindowWidth);

        ctx.translate(pipWindowWidth / 2, pipWindowWidth / 2);

        ctx.beginPath();
        ctx.arc(0, 0, pipWindowWidth / 2 - 40, 0, Math.PI * 2);

        ctx.strokeStyle = themeMode === "light" ? "#d6d6d6" : "#686868";
        ctx.lineWidth = 24;
        ctx.stroke();

        ctx.fillStyle = themeMode === "dark" ? "#fff" : "#1f1f1f";
        ctx.font = `${pipWindowWidth / 8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
          `${Math.floor(secondsLeft / 60)}:${
            secondsLeft % 60 < 10 ? "0" + (secondsLeft % 60) : secondsLeft % 60
          }`,
          0,
          0,
        );

        ctx.font = `${pipWindowWidth / 16}px Arial`;
        ctx.fillStyle = themeMode === "dark" ? "#bbb" : "#333";

        if (percentage < 100) {
          ctx.fillText(`第 ${rotationCount + 1} 輪`, 0, pipWindowWidth / 4);
        }

        ctx.rotate(-Math.PI / 2);

        ctx.beginPath();
        ctx.arc(
          0,
          0,
          pipWindowWidth / 2 - 40,
          0,
          (Math.PI * 2 * percentage) / 100,
        );
        ctx.strokeStyle = pathColor;
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.rotate(Math.PI / 2);
        ctx.translate(-pipWindowWidth / 2, -pipWindowWidth / 2);
      }
    }
  }, [themeMode, secondsLeft, rotationCount, percentage, pathColor]);

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
    <>
      <canvas
        ref={canvasRef}
        width={pipWindowWidth}
        height={pipWindowWidth}
        style={{ display: "none" }}
      />

      {page === null && percentage < 100 ? (
        <Card
          className="fixed right-6 bottom-40 z-10 w-36 cursor-pointer bg-white p-4 opacity-80"
          onClick={() => {
            handleTimerPageClick();
          }}
        >
          <CircularProgressbarWithChildren
            value={percentage}
            styles={buildStyles({
              textColor: "#000",
              pathColor: pathColor,
              trailColor: "#d6d6d6",
            })}
            strokeWidth={10}
            className="size-full"
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
      ) : null}

      <video ref={videoRef} style={{ display: "none" }} muted playsInline />
    </>
  );
};

export default TimerDisplayPanel;
