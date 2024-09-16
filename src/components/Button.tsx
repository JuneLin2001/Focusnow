import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// 通用按鈕組件
const Button = ({ onClick, children, className, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-white font-bold py-2 px-4 rounded ${className}`}
      disabled={disabled} // 設置 disabled 屬性
    >
      {children}
    </button>
  );
};

// 藍色默認按鈕
export const DefaultButton = ({ onClick, children }: ButtonProps) => (
  <Button onClick={onClick} className="bg-blue-500 hover:bg-blue-700">
    {children}
  </Button>
);

// 紅色重置按鈕
export const ResetButton = ({ onClick, children }: ButtonProps) => (
  <Button onClick={onClick} className="bg-red-500 hover:bg-red-700">
    {children}
  </Button>
);

// 可以用來添加或減少時間的按鈕
export const AddOrSubtractButton = ({
  onClick,
  children,
  disabled,
}: ButtonProps) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className="bg-blue-500 hover:bg-blue-700" // 用不同的顏色來區分
  >
    {children}
  </Button>
);
