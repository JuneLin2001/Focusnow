import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  AlarmClock,
  ChartColumn,
  FishSymbol,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

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
        description: (
          <>
            歡迎來到Focusnow！
            <br />
            這是一個番茄鐘結合3D養成遊戲的網站。
          </>
        ),
        targetPosition: [-50, 12, -1500] as [number, number, number],
      },
      {
        title: "功能介紹",
        description: "可以透過移動鏡頭來自由探索場景。",
        targetPosition: [-100, 60, 10] as [number, number, number],
      },
      {
        title: "互動操作",
        description: (
          <>
            點擊 &nbsp;
            <Button variant="default">
              <AlarmClock /> <div className="ml-2 leading-[24px]">Timer</div>
            </Button>
            &nbsp; 可以進入番茄鐘頁面
            <br />
            在登入後能將資料儲存在資料庫。
          </>
        ),
        targetPosition: [-100, 60, 10] as [number, number, number],
      },
      {
        title: "互動操作",
        description: (
          <>
            點擊 &nbsp;
            <Button variant="default">
              <ChartColumn />{" "}
              <div className="ml-2 leading-[24px]">Analytics</div>
            </Button>
            &nbsp; 可查看統計資料。
          </>
        ),
        targetPosition: [-100, 60, 10] as [number, number, number],
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
        targetPosition: [-100, 60, 10] as [number, number, number],
      },
      {
        title: "互動操作",
        description: (
          <>
            完成專注時，每專注1分鐘能獲得1條魚
            <br />
            可以點擊 &nbsp;
            <Button variant="default">
              <FishSymbol /> <div className="ml-2 leading-[24px]">0</div>
            </Button>
            &nbsp; 放下魚來和企鵝互動。
          </>
        ),
        targetPosition: [-100, 60, 10] as [number, number, number],
      },
      {
        title: "互動操作",
        description: <>現在就使用 Focusnow開始專注吧！</>,
        targetPosition: [-250, 60, 10] as [number, number, number],
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

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[60]">
          <div className="fixed inset-0 flex justify-center items-center bg-transparent z-40">
            <div className="bg-white bg-opacity-100 p-5 rounded shadow-lg w-96 h-52 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X />
                </Button>
              </div>{" "}
              <div>
                <h2 className="text-xl mb-4">{steps[currentStep].title}</h2>
                <p className="mb-4">{steps[currentStep].description}</p>
              </div>
              <div className="flex justify-between">
                {currentStep > 0 ? (
                  <Button
                    variant="ghost"
                    className="disabled:cursor-not-allowed"
                    onClick={handlePrevious}
                  >
                    {<ChevronLeft />}&nbsp;上一步
                  </Button>
                ) : (
                  <div></div>
                )}

                <Button variant="ghost" onClick={handleNext}>
                  {currentStep < steps.length - 1 ? (
                    <>
                      下一步&nbsp;
                      <ChevronRight />
                    </>
                  ) : (
                    "開始！"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InitialInstructions;
