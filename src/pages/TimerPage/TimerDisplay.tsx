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
import { toast } from "react-toastify";

interface TimerDisplayProps {
  page: string | null;
  setPage: (newPage: "timer" | "analytics" | "Setting" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  page,
  setPage,
  setTargetPosition,
}) => {
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
        ctx.clearRect(0, 0, pipWindowWidth, pipWindowWidth);

        ctx.fillStyle = themeMode === "dark" ? "#000" : "#fff";
        ctx.fillRect(0, 0, pipWindowWidth, pipWindowWidth);

        ctx.translate(pipWindowWidth / 2, pipWindowWidth / 2);

        ctx.beginPath();
        ctx.arc(0, 0, pipWindowWidth / 2 - 40, 0, Math.PI * 2);

        ctx.strokeStyle = "#d6d6d6";
        ctx.lineWidth = 24;
        ctx.stroke();

        ctx.fillStyle = themeMode === "dark" ? "#fff" : "#000";
        ctx.font = `${pipWindowWidth / 8}px Arial`;
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

        ctx.beginPath();
        ctx.arc(
          0,
          0,
          pipWindowWidth / 2 - 40,
          0,
          (Math.PI * 2 * percentage) / 100
        );
        ctx.strokeStyle = pathColor;
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.rotate(Math.PI / 2);
        ctx.translate(-pipWindowWidth / 2, -pipWindowWidth / 2);
      }
    }
  }, [themeMode, secondsLeft, percentage, pathColor]);

  const enterPiP = useCallback(async () => {
    if (!document.pictureInPictureEnabled) {
      toast.error("您的瀏覽器不支援進入 Picture-in-Picture 模式");
      return;
    }

    if (isPipActive) {
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
      if (document.hidden || page !== "timer") {
        enterPiP();
      } else {
        exitPiP();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enterPiP, exitPiP, page]);

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
    <>
      <canvas
        ref={canvasRef}
        width={pipWindowWidth}
        height={pipWindowWidth}
        style={{ display: "none" }}
      />

      {page === null && percentage < 100 ? (
        <Card
          className="fixed bottom-40 right-6 p-4 bg-white opacity-80 z-10 w-36 cursor-pointer"
          onClick={() => {
            setTargetPosition([-50, 12, -150]);
            setPage("timer");
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

      <div className="fixed ">
        <Button
          variant="timerGhost"
          size="icon"
          onClick={isPipActive ? exitPiP : enterPiP}
        >
          <PictureInPicture />
        </Button>
      </div>
    </>
  );
};

export default TimerDisplay;
