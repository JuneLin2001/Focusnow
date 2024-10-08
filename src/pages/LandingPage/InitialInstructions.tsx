import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AlarmClock, ChartColumn, FishSymbol } from "lucide-react";

interface InitialInstructionsProps {
  showInstructions: boolean;
  handleCloseInstructions: () => void;
  handleComplete: () => void;
  setTargetPosition: (position: [number, number, number]) => void;
}

const InitialInstructions: React.FC<InitialInstructionsProps> = ({
  showInstructions,
  handleCloseInstructions,
  handleComplete,
  setTargetPosition,
}) => {
  const [isVisible, setIsVisible] = useState(showInstructions);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(
    () => [
      {
        title: "場景介紹",
        description: "歡迎來到Focusnow！這是一個番茄鐘結合3D養成遊戲的網站。",
        targetPosition: [-300, 60, 10] as [number, number, number],
      },
      {
        title: "功能介紹",
        description: "可以透過移動鏡頭來自由探索場景。",
        targetPosition: [-50, 12, -1500] as [number, number, number],
      },
      {
        title: "互動操作",
        description: (
          <>
            點擊
            <Button variant="default" disabled>
              <AlarmClock /> Timer
            </Button>
            可以進入番茄鐘頁面，在登入後能將資料儲存在資料庫。
          </>
        ),
        targetPosition: [-300, 60, 10] as [number, number, number],
      },
      {
        title: "互動操作",
        description: (
          <>
            登入後點擊
            <Button variant="default" disabled>
              <ChartColumn /> Analytics
            </Button>
            可以查看統計資料。
          </>
        ),
        targetPosition: [-50, 12, -1500] as [number, number, number],
      },
      {
        title: "互動操作",
        description: (
          <>
            點擊告示牌可以看到最近30天的專注分鐘數
            <br />
            一次專注15分鐘以上，場景中就會多出一隻可互動的企鵝。
          </>
        ),
        targetPosition: [-50, 12, -1500] as [number, number, number],
      },
      {
        title: "互動操作",
        description: (
          <>
            完成專注時，每專注1分鐘能獲得1條魚
            <br />
            可以點擊
            <Button variant="default" disabled>
              <FishSymbol /> 0
            </Button>
            放下魚來和企鵝互動。
          </>
        ),
        targetPosition: [-50, 12, -1500] as [number, number, number],
      },
      {
        title: "互動操作",
        description: "現在就來使用Focusnow開始專注吧！",
        targetPosition: [-300, 60, 10] as [number, number, number],
      },
    ],
    []
  );

  useEffect(() => {
    setIsVisible(showInstructions);
    setCurrentStep(0);
  }, [showInstructions]);

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      setTargetPosition(steps[currentStep].targetPosition);
    }
  }, [currentStep, isVisible, setTargetPosition, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    handleCloseInstructions();
    handleComplete();
  };

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40">
          <div className="fixed inset-0 flex justify-center items-center bg-transparent z-40">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="text-xl mb-4">{steps[currentStep].title}</h2>
              <p className="mb-4">{steps[currentStep].description}</p>

              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={handleNext}
                >
                  {currentStep < steps.length - 1 ? "下一步" : "開始！"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InitialInstructions;
