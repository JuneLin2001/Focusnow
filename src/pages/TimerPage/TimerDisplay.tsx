import { useRef, useEffect, useCallback, useState } from "react";
import { useTimerStore } from "../../store/timerStore";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import settingStore from "../../store/settingStore";
import { Button } from "@/components/ui/button";
import { PictureInPicture } from "lucide-react";
import { Card } from "@/components/ui/card";

const TimerDisplay = () => {
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

  const pipWindowWidth = 360;

  const drawOnCanvas = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // 清除畫布
        ctx.clearRect(0, 0, pipWindowWidth, pipWindowWidth); // 畫布大小 pipWindowWidth x pipWindowWidth

        // 設定背景顏色
        ctx.fillStyle = themeMode === "dark" ? "#000" : "#fff"; // 背景顏色改回純色
        ctx.fillRect(0, 0, pipWindowWidth, pipWindowWidth); // 背景填滿 pipWindowWidth x pipWindowWidth

        // 將原點移到圓心（考慮 padding，圓心改為 pipWindowWidth / 2，pipWindowWidth / 2）
        ctx.translate(pipWindowWidth / 2, pipWindowWidth / 2);

        ctx.beginPath();
        ctx.arc(0, 0, pipWindowWidth / 2 - 20, 0, Math.PI * 2); // 大圓環半徑

        ctx.strokeStyle = "#d6d6d6"; // 底色圓環顏色
        ctx.lineWidth = 20; // 圓環的寬度
        ctx.stroke(); // 繪製圓環

        // 設定文本樣式
        ctx.fillStyle = themeMode === "dark" ? "#fff" : "#000";
        ctx.font = `${pipWindowWidth / 9}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
          `${Math.floor(secondsLeft / 60)}:${
            secondsLeft % 60 < 10 ? "0" + (secondsLeft % 60) : secondsLeft % 60
          }`,
          0,
          0
        );

        ctx.rotate(-Math.PI / 2);

        // 開始繪製圓形，考慮到 padding，半徑改為 (pipWindowWidth / 2 - 20)
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          pipWindowWidth / 2 - 20,
          0,
          (Math.PI * 2 * percentage) / 100
        ); // 半徑改為 (pipWindowWidth / 2 - 20)
        ctx.strokeStyle = pathColor;
        ctx.lineWidth = 20;
        ctx.lineCap = "round"; // 設置圓角效果
        ctx.stroke();

        // 還原旋轉
        ctx.rotate(Math.PI / 2); // 將旋轉恢復到原來的狀態
        ctx.translate(-pipWindowWidth / 2, -pipWindowWidth / 2); // 將原點移回左上角
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

  // 檢查瀏覽器是否支援 Picture-in-Picture
  const isPiPSupported = document.pictureInPictureEnabled;

  return (
    <>
      <canvas
        ref={canvasRef}
        width={pipWindowWidth}
        height={pipWindowWidth}
        style={{ display: "none" }}
      />

      {!isPipActive && !isPiPSupported ? (
        <Card className="fixed bottom-40 right-6 p-4 bg-white opacity-80 z-10 w-36">
          <CircularProgressbarWithChildren
            value={percentage}
            styles={buildStyles({
              textColor: "#000",
              pathColor: pathColor,
              trailColor: "#d6d6d6",
            })}
            strokeWidth={10}
            className="w-full h-full"
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

      <div className="fixed bottom-28 right-6">
        {!isPipActive ? (
          <Button onClick={enterPiP} disabled={!isPiPSupported}>
            <PictureInPicture />
          </Button>
        ) : (
          <Button onClick={exitPiP}>
            <PictureInPicture />
          </Button>
        )}
      </div>
    </>
  );
};

export default TimerDisplay;
