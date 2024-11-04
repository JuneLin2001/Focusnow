import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PictureInPicture } from "lucide-react";
import { toast } from "react-toastify";
import { useTimerStore } from "../../store/timerStore";

const PipButton = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPipActive, setIsPipActive] = useState(false);
  const { canvasRef } = useTimerStore();

  const enterPiP = useCallback(async () => {
    if (!document.pictureInPictureEnabled) {
      toast.error("您的瀏覽器不支援進入 Picture-in-Picture 模式");
      return;
    }

    if (isPipActive) return;

    if (canvasRef && canvasRef.current && videoRef.current) {
      try {
        const stream = canvasRef.current.captureStream();
        videoRef.current.srcObject = stream;

        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });

        await videoRef.current.play();
        await videoRef.current.requestPictureInPicture();
        setIsPipActive(true);
      } catch (error) {
        console.error("Error entering Picture-in-Picture mode", error);
        toast.error("請檢查瀏覽器是否支援 Picture-in-Picture 模式");
      }
    }
  }, [canvasRef, isPipActive, setIsPipActive]);

  const exitPiP = useCallback(async () => {
    if (document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
        setIsPipActive(false);
      } catch (error) {
        console.error("Error exiting Picture-in-Picture mode", error);
        toast.error("無法退出 Picture-in-Picture 模式");
      }
    }
  }, [setIsPipActive]);

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
  }, [setIsPipActive]);

  return (
    <div>
      <Button
        id="pip-button"
        variant="timerGhost"
        size="icon"
        onClick={isPipActive ? exitPiP : enterPiP}
      >
        <PictureInPicture />
      </Button>
      <video ref={videoRef} style={{ display: "none" }} muted playsInline />
    </div>
  );
};

export default PipButton;
