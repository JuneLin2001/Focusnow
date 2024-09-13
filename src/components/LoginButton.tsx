import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import useAuthStore from "../store/authStore";

const LoginButton = () => {
  const { setUser } = useAuthStore();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // 更新全局狀態中的使用者資訊
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 text-white p-2 rounded"
    >
      Login with Google
    </button>
  );
};

export default LoginButton;
