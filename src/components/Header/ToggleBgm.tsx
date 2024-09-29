import { useRef, useEffect } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import IconButton from "@mui/material/IconButton";
import useSettingStore from "../../store/settingStore"; // 引入 BgmStore

const ToggleBgm = () => {
  const { isPlaying, bgmSource, toggleBgm } = useSettingStore(); // 從 BgmStore 獲取狀態和方法
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 當音樂來源改變時，更新 audio 元素的 src
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = bgmSource;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [bgmSource, isPlaying]); // 當 bgmSource 或 isPlaying 改變時觸發

  const handleToggleBgm = () => {
    toggleBgm(); // 使用 BgmStore 的 toggleBgm 方法
  };

  return (
    <>
      <IconButton onClick={handleToggleBgm} color="inherit" sx={{ mr: 1 }}>
        {isPlaying ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <audio ref={audioRef} loop>
        Your browser does not support the audio element.
      </audio>
    </>
  );
};

export default ToggleBgm;
