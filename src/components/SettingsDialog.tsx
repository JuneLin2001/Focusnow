import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"; // 引入Shadcn的對話框組件
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // 引入Shadcn的標籤組件
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // 引入自定義的RadioGroup
import useSettingStore from "../store/settingStore"; // 引入SettingStore

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
    useSettingStore();
  const [selectedMusic, setSelectedMusic] = useState<string>(
    musicOptions[0].value
  );

  useEffect(() => {
    if (open) {
      setSelectedMusic(musicOptions[0].value);
    }
  }, [open]);

  const handleMusicChange = (value: string) => {
    setSelectedMusic(value);
    setBgmSource(value);
    if (isPlaying) {
      toggleBgm();
    }
    toggleBgm();
  };

  const handleThemeChange = (value: string) => {
    const mode = value as "light" | "dark";
    setThemeMode(mode);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button>設定</Button> {/* 這裡添加一個觸發按鈕以便打開對話框 */}
      </DialogTrigger>
      <DialogContent>
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

        <Label className="mt-4">選擇主題模式：</Label>
        <RadioGroup value={themeMode} onValueChange={handleThemeChange}>
          <div>
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">白天模式</Label>
          </div>
          <div>
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">黑夜模式</Label>
          </div>
        </RadioGroup>
        <div className="mt-4">
          <Button onClick={onClose}>關閉</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
