import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { CircleUser, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { useTimerStore } from "../../store/timerStore";
import { saveTaskData } from "../../firebase/firebaseService";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import googleLogo from "../../assets/icons/icons8-google.svg";
import guestLogo from "../../assets/icons/user-round-x.svg";

const LoginForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { hideLogin } = useTimerStore();
  const { setUser } = useAuthStore();

  const handleEmailRegister = async () => {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        toast.error("電子郵件格式不正確，請重新檢查");
        return;
      }
      if (!password || password.length < 6) {
        toast.error("密碼至少需要 6 個字符");
        return;
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setUser(result.user);
      hideLogin();
      await saveTaskDataFromLocalStorage(result.user);
      setIsDialogOpen(false);
      toast.success("註冊成功！");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            toast.error("電子郵件格式不正確，請重新檢查");
            break;
          case "auth/email-already-in-use":
            toast.error("此電子郵件已被使用");
            break;
          default:
            toast.error("註冊失敗，請稍後再試");
        }
      }
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      hideLogin();
      await saveTaskDataFromLocalStorage(result.user);
      setIsDialogOpen(false);
      toast.success("登入成功！");
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error("電子郵件或密碼錯誤");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      hideLogin();
      await saveTaskDataFromLocalStorage(user);
      setIsDialogOpen(false);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            toast.error("您已關閉登入彈窗，請再試一次");
            break;
          default:
            toast.error("Google 登入失敗，請稍後再試");
        }
      }
    }
  };

  const handleGuestLogin = async () => {
    const guestEmail = "focusnowtest@email.com";
    const guestPassword = "focusnowtest";
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        guestEmail,
        guestPassword,
      );
      setUser(result.user);
      hideLogin();
      await saveTaskDataFromLocalStorage(result.user);
      setIsDialogOpen(false);
      toast.success("以訪客身份登入成功！");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            toast.error("找不到訪客帳號，請聯絡管理員");
            break;
          case "auth/wrong-password":
            toast.error("訪客帳號密碼錯誤，請聯絡管理員");
            break;
          default:
            toast.error("訪客登入失敗，請稍後再試");
        }
      }
    }
  };

  const saveTaskDataFromLocalStorage = async (user: User) => {
    const taskDataString = localStorage.getItem("taskData");
    if (taskDataString) {
      const taskData = JSON.parse(taskDataString);
      const taskDataToSave = {
        ...taskData,
        startTime: { seconds: taskData.startTime.seconds, nanoseconds: 0 },
        endTime: { seconds: taskData.endTime.seconds, nanoseconds: 0 },
        todos: taskData.todos.map(
          (todo: {
            startTime: { seconds: number };
            doneTime: { seconds: number };
          }) => ({
            ...todo,
            startTime: { seconds: todo.startTime.seconds, nanoseconds: 0 },
            doneTime: todo.doneTime
              ? { seconds: todo.doneTime.seconds, nanoseconds: 0 }
              : null,
          }),
        ),
      };

      await saveTaskData(user, taskDataToSave);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="roundedicon"
        onClick={() => setIsDialogOpen(true)}
      >
        <Avatar>
          <AvatarFallback>
            <CircleUser className="size-5" />
          </AvatarFallback>
        </Avatar>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRegistering ? "註冊" : "登入"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "已有帳戶？登入" : "還沒有帳戶？註冊"}
            </Button>

            <Button
              variant="default"
              onClick={isRegistering ? handleEmailRegister : handleEmailLogin}
            >
              {isRegistering ? "註冊" : "登入"}
            </Button>
          </DialogFooter>
          <div className="flex items-center">
            <Separator className="flex-1" />
            <p className="px-4 text-gray-500">Or continue with</p>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-col gap-4">
            <Button
              className="flex items-center justify-center space-x-2"
              variant="outline"
              onClick={handleGoogleLogin}
            >
              &nbsp; &nbsp; &nbsp; &nbsp;
              <img src={googleLogo} alt="logo" className="h-6" />
              <span className="align-middle">使用 Google 帳號登入</span>
            </Button>

            <Button
              className="flex items-center justify-center space-x-2"
              variant="outline"
              onClick={handleGuestLogin}
            >
              <img src={guestLogo} alt="logo" className="h-6 dark:invert" />
              <span className="align-middle">使用訪客帳號登入</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
