import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-white w-[300px] h-[100vh] fixed top-0 left-0 z-10 flex flex-col p-5 outline ">
      <div className="flex-1 flex flex-col justify-center">
        <Link to="/" className="text-black mb-4 text-xl hover:text-gray-400">
          Homepage
        </Link>
        <Link
          to="/game"
          className="text-black mb-4 text-xl hover:text-gray-400"
        >
          Game
        </Link>
        <Link
          to="/analytics"
          className="text-black text-xl hover:text-gray-400"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
