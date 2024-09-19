import LoginButton from "../../components/LoginButton";
import useAuthStore from "../../store/authStore";
import { DefaultButton } from "../../components/Button";

interface HeaderProps {
  setPage: React.Dispatch<
    React.SetStateAction<"timer" | "analytics" | "game" | null>
  >;
  setTargetPosition: React.Dispatch<
    React.SetStateAction<[number, number, number] | null>
  >;
}

const Header: React.FC<HeaderProps> = ({ setPage, setTargetPosition }) => {
  const { user } = useAuthStore();

  const handleLoginSuccess = () => {
    console.log("handleLoginSuccess");
  };

  return (
    <div className="fixed flex justify-center items-center w-full h-16 mb-5 py-10 bg-[#D9D9D9]  z-50">
      <div className="header">
        <DefaultButton
          onClick={() => {
            setTargetPosition([-16, 2, 0]); // 移動相機到 "timer" 頁面的位置
            setPage("timer"); // 切換到 Timer 頁面
          }}
        >
          Timer Page
        </DefaultButton>
        <DefaultButton
          onClick={() => {
            setPage("analytics");
            setTargetPosition([-116, 2, 0]);
          }}
        >
          Analytics Page
        </DefaultButton>
        <DefaultButton
          onClick={() => {
            setPage("game");
            setTargetPosition([5, 60, 10]);
          }}
        >
          Game Page
        </DefaultButton>
      </div>
      {user ? (
        <div className="flex items-center mr-5">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User Photo"
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <div>
            <div className="text-xl font-semibold">{user.displayName}</div>
            <div className="text-gray-600">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-gray-600">Not logged in</div>
      )}
      <LoginButton onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Header;
