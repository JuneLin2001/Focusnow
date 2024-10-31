import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useSettingStore from "../../store/settingStore";
import { useTimerStore } from "../../store/timerStore";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  isPaused: boolean;
}

const musicOptions = [
  {
    value:
      "/yt5s.io - 大自然的白噪音 1小時｜森林鳥鳴聲，身心放鬆，平靜學習輔助 (320 kbps).mp3",
    label: "【白噪音】大自然",
  },
  {
    value:
      "/yt5s.io - 【白噪音】療癒海浪聲 讓你放空and放鬆 _ 消除疲勞 _ 解壓 _ 睡眠 _ 放空 │relaxing│sleeping (320 kbps)_1.mp3",
    label: "【白噪音】療癒海浪聲",
  },
];

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  isPaused,
}) => {
  const { isPlaying, toggleBgm, setBgmSource } = useSettingStore();
  const {
    breakMinutes,
    maxRotationCount,
    setBreakMinutes,
    setMaxRotationCount,
  } = useTimerStore();

  const [selectedMusic, setSelectedMusic] = useState<string>(
    musicOptions[0].value
  );
  const [breakTime, setBreakTime] = useState<number>(breakMinutes);
  const [rotationCount, setRotationCount] = useState<number>(maxRotationCount); // 新增狀態

  useEffect(() => {
    if (open) {
      setSelectedMusic(musicOptions[0].value);
      setBreakTime(breakMinutes);
      setRotationCount(maxRotationCount); // 設置初始值
    }
  }, [open, breakMinutes, maxRotationCount]);

  const handleMusicChange = (value: string) => {
    setSelectedMusic(value);
    setBgmSource(value);
    if (isPlaying) {
      toggleBgm();
    }
    toggleBgm();
  };

  const handleSliderChange = (value: number[]) => {
    setBreakTime(value[0]);
    setBreakMinutes(value[0]);
  };

  const handleRotationCountChange = (value: number[]) => {
    setRotationCount(value[0]); // 更新當前的旋轉次數
    setMaxRotationCount(value[0]); // 設置最大旋轉次數
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle>設定</DialogTitle>
        <Label>選擇播放的背景音樂：</Label>
        <RadioGroup value={selectedMusic} onValueChange={handleMusicChange}>
          {musicOptions.map((music) => (
            <div key={music.value}>
              <RadioGroupItem value={music.value} id={music.value} />
              <Label htmlFor={music.value}>{music.label}</Label>
            </div>
          ))}
        </RadioGroup>
        <Label className="mt-4">
          {isPaused
            ? `設定休息時間為 ${breakTime} 分鐘`
            : `現在的休息時間為 ${breakTime} 分鐘，專注狀態時不可編輯`}
        </Label>
        <DualRangeSlider
          value={[breakTime]}
          onValueChange={handleSliderChange}
          min={1}
          max={30}
          step={1}
          disabled={!isPaused}
        />
        <Label className="mt-4">
          {" "}
          {isPaused
            ? `番茄鐘進行輪數：${rotationCount}`
            : `目前番茄鐘的輪數上限是 ${rotationCount} 輪，專注狀態時不可編輯`}
        </Label>
        <DualRangeSlider
          value={[rotationCount]}
          onValueChange={handleRotationCountChange}
          min={1}
          max={10}
          step={1}
          disabled={!isPaused}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
