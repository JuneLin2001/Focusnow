import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";

interface LoginButtonProps {
  onLoginSuccess: () => void; // Add prop for login success callback
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLoginSuccess }) => {
  const { user, setUser, logout } = useAuthStore();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // 更新全局狀態中的使用者資訊
      onLoginSuccess(); // Notify that login was successful
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // 使用全局狀態中的登出方法
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <button
      onClick={user ? handleLogout : handleLogin}
      className="bg-blue-500 text-white p-2 rounded"
    >
      {user ? "Logout" : "Login with Google"}
    </button>
  );
};

export default LoginButton;
