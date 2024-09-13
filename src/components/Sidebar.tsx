import { Link } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex">
      <button
        onClick={toggleSidebar}
        className="absolute top-96 left-4 z-20 bg-blue-500 text-white p-2 rounded"
      >
        {isOpen ? "Close" : "Open"}
      </button>

      <div
        className={`fixed top-0 left-0 w-[300px] h-[100vh] bg-white z-10 flex flex-col p-5 outline transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-[-280px]" // 留下80px的寬度
        }`}
      >
        <div className="flex-1 flex flex-col justify-center">
          <Link
            to="/"
            className="text-black mb-4 text-xl hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Homepage
          </Link>
          <Link
            to="/game"
            className="text-black mb-4 text-xl hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Game
          </Link>
          <Link
            to="/analytics"
            className="text-black text-xl hover:text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
