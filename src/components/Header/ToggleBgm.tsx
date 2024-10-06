import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useSettingStore from "../../store/settingStore";
import { Volume2, VolumeOff } from "lucide-react";
const ToggleBgm = () => {
  const { isPlaying, bgmSource, toggleBgm } = useSettingStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = bgmSource;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [bgmSource, isPlaying]);

  const handleToggleBgm = () => {
    toggleBgm();
  };

  return (
    <>
      <Button variant="ghost" onClick={handleToggleBgm} color="inherit">
        {isPlaying ? <VolumeOff /> : <Volume2 />}
      </Button>
      <audio ref={audioRef} loop>
        Your browser does not support the audio element.
      </audio>
    </>
  );
};

export default ToggleBgm;
