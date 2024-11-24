import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import steps from "./InitialInstructionsSteps";

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

  useEffect(() => {
    setIsVisible(showInstructions);
    setCurrentStep(0);
  }, [showInstructions]);

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      setTargetPosition(steps[currentStep].targetPosition);
    }
  }, [currentStep, isVisible, setTargetPosition]);

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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-transparent">
            <div className="relative flex h-52 w-96 flex-col justify-between rounded bg-white bg-opacity-100 p-5 shadow-lg">
              <div className="absolute right-4 top-4">
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X />
                </Button>
              </div>{" "}
              <div>
                <h2 className="mb-4 text-xl">{steps[currentStep].title}</h2>
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
