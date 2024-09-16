import { useState } from "react";

const TodoList = () => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const toggleSidebar = () => {
    setisOpen(!isOpen);
  };

  return (
    <div className="relative flex">
      <button
        onClick={toggleSidebar}
        className="absolute bottom-4 right-4 z-20 bg-blue-500 text-white p-2 rounded"
      >
        {isOpen ? "Close" : "Open"}
      </button>

      <div
        className={`fixed bottom-0 right-0 w-[300px] h-[600px] bg-white z-10 flex flex-col p-5 outline transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-[580px]" // 留下20px的高度
        }`}
      ></div>
    </div>
  );
};

export default TodoList;
