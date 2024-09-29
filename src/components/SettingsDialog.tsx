// SettingsDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import useSettingStore from "../store/settingStore"; // 引入 BgmStore

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const musicOptions = [
  {
    value:
      "/yt5s.io - 大自然的白噪音 1小時｜森林鳥鳴聲，身心放鬆，平靜學習輔助 (320 kbps).mp3",
    label: "大自然的白噪音",
  },
  {
    value:
      "/yt5s.io - 【白噪音】療癒海浪聲 讓你放空and放鬆 _ 消除疲勞 _ 解壓 _ 舒眠 _ 冥想 _ ASMR _ 讀書 _ 學習幫助 _ 睡眠 _ 放空 │relaxing│sleeping (320 kbps)_1.mp3",
    label: "【白噪音】療癒海浪聲",
  },
];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { isPlaying, toggleBgm, setBgmSource, themeMode, setThemeMode } =
    useSettingStore(); // 引入 BgmStore 的狀態和方法
  const [selectedMusic, setSelectedMusic] = useState<string>(
    musicOptions[0].value
  ); // 預設選擇的音樂

  // 當開啟對話框時，設定預設音樂
  useEffect(() => {
    if (open) {
      setSelectedMusic(musicOptions[0].value);
    }
  }, [open]);

  const handleMusicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMusic = event.target.value;
    setSelectedMusic(newMusic);
    setBgmSource(newMusic); // 更新 BgmStore 中的音樂來源
    if (isPlaying) {
      toggleBgm(); // 如果正在播放，切換一下以重新播放新選擇的音樂
    }
    toggleBgm(); // 播放新的背景音樂
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const mode = event.target.value as "light" | "dark";
    setThemeMode(mode); // 更新主題模式
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Typography>選擇播放的背景音樂：</Typography>
        <RadioGroup value={selectedMusic} onChange={handleMusicChange}>
          {musicOptions.map((music) => (
            <FormControlLabel
              key={music.value}
              value={music.value}
              control={<Radio />}
              label={music.label}
            />
          ))}
        </RadioGroup>

        <Typography sx={{ mt: 2 }}>選擇主題模式：</Typography>
        <RadioGroup value={themeMode} onChange={handleThemeChange}>
          <FormControlLabel
            value="light"
            control={<Radio />}
            label="白天模式"
          />
          <FormControlLabel value="dark" control={<Radio />} label="黑夜模式" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
