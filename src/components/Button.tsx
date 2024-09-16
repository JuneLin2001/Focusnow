import React from "react";

interface DefaultButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const DefaultButton = ({ onClick, children }: DefaultButtonProps) => {
  return (
    <button
      onClick={onClick} // 將 onClick 綁定到按鈕的點擊事件
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {children} {/* 使用 children 來顯示按鈕的內容 */}
    </button>
  );
};

export const ResetButton = ({ onClick, children }: DefaultButtonProps) => {
  return (
    <button
      onClick={onClick} // 將 onClick 綁定到按鈕的點擊事件
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      {children} {/* 使用 children 來顯示按鈕的內容 */}
    </button>
  );
};
