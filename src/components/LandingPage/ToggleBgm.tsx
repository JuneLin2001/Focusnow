import { useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import useSettingStore from "../../store/settingStore";
import { Volume2, VolumeOff } from "lucide-react";

const ToggleBgm = () => {
  const { isPlaying, bgmSource, toggleBgm, saveUserSettings } =
    useSettingStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = bgmSource;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("播放音樂時發生錯誤:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [bgmSource, isPlaying]);

  const handleToggleBgm = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("播放音樂時發生錯誤:", error);
        });
      }
    }
    toggleBgm();
    await saveUserSettings();
  };

  return (
    <>
      <div className="fixed bottom-10 right-10 z-10 flex items-center justify-center">
        <Button
          variant="outline"
          onClick={handleToggleBgm}
          className="flex size-12 items-center justify-center rounded-full shadow-lg"
        >
          {isPlaying ? <Volume2 /> : <VolumeOff />}
        </Button>
      </div>
      <audio ref={audioRef} loop>
        Your browser does not support the audio element.
      </audio>
    </>
  );
};

export default ToggleBgm;
