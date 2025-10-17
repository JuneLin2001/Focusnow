import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTimerStore } from "@/store/timerStore";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  isPaused: boolean;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  isPaused,
}) => {
  const {
    breakMinutes,
    maxRotationCount,
    setBreakMinutes,
    setMaxRotationCount,
  } = useTimerStore();

  const [breakTime, setBreakTime] = useState<number>(breakMinutes);
  const [rotationCount, setRotationCount] = useState<number>(maxRotationCount);

  useEffect(() => {
    if (open) {
      setBreakTime(breakMinutes);
      setRotationCount(maxRotationCount);
    }
  }, [open, breakMinutes, maxRotationCount]);

  const handleSliderChange = (value: number[]) => {
    setBreakTime(value[0]);
    setBreakMinutes(value[0]);
  };

  const handleRotationCountChange = (value: number[]) => {
    setRotationCount(value[0]);
    setMaxRotationCount(value[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle>設定</DialogTitle>
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
