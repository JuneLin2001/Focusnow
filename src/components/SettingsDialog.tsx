import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useSettingStore from "../store/settingStore"; // 引入 SettingStore
import { useTimerStore } from "../store/timerStore"; // 引入 TimerStore

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
  const { isPlaying, toggleBgm, setBgmSource } = useSettingStore();
  const { breakMinutes, setBreakMinutes } = useTimerStore();
  const [selectedMusic, setSelectedMusic] = useState<string>(
    musicOptions[0].value
  );
  const [breakTime, setBreakTime] = useState<number>(breakMinutes);

  useEffect(() => {
    if (open) {
      setSelectedMusic(musicOptions[0].value);
      setBreakTime(breakMinutes);
    }
  }, [open, breakMinutes]);

  const handleMusicChange = (value: string) => {
    setSelectedMusic(value);
    setBgmSource(value);
    if (isPlaying) {
      toggleBgm();
    }
    toggleBgm();
  };

  const handleBreakTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setBreakTime(value);
    setBreakMinutes(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">設定</DialogTitle>
        <DialogDescription className="mb-4">
          選擇你的背景音樂和主題模式。
        </DialogDescription>
        <h3 className="text-lg font-medium">設定</h3>
        <Label>選擇播放的背景音樂：</Label>
        <RadioGroup value={selectedMusic} onValueChange={handleMusicChange}>
          {musicOptions.map((music) => (
            <div key={music.value}>
              <RadioGroupItem value={music.value} id={music.value} />
              <Label htmlFor={music.value}>{music.label}</Label>
            </div>
          ))}
        </RadioGroup>
        <Label className="mt-4">設定休息時間（分鐘）：</Label>
        <input
          type="number"
          value={breakTime}
          onChange={handleBreakTimeChange}
          className="border border-gray-300 rounded p-2 mt-2"
          min={1}
          max={120}
        />
        <div className="mt-4">
          <Button onClick={onClose}>關閉</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
