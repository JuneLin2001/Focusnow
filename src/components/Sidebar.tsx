import { Link } from "react-router-dom";
import useSidebarStore from "../store/sidebarStore";
import useAuthStore from "../store/authStore";
import LoginButton from "./LoginButton";

const Sidebar = () => {
  const { user } = useAuthStore();
  const { isOpen, toggleSidebar } = useSidebarStore();

  const handleLoginSuccess = () => {
    console.log("handleLoginSuccess");
  };

  return (
    <div className="relative flex">
      <button
        onClick={toggleSidebar}
        className="absolute top-96 left-80 z-30 bg-blue-500 text-white p-2 rounded"
      >
        {isOpen ? "Close" : "Open"}
      </button>

      <div
        className={`fixed top-0 left-0 w-[300px] h-[100vh] bg-white z-20 flex flex-col p-5 outline transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-[-280px]" // 留下80px的寬度
        }`}
      >
        <div className="flex-1 flex flex-col justify-center">
          {user ? (
            <div className="mb-4">
              <div className="flex items-center mb-4">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="User Photo"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <div className="text-xl font-semibold">
                    {user.displayName}
                  </div>
                  <div className="text-gray-600">{user.email}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 text-gray-600">Not logged in</div>
          )}
          <LoginButton onLoginSuccess={handleLoginSuccess} />
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
    </div>
  );
};

export default Sidebar;
