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
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTimerStore } from "../../store/timerStore";
import { saveTaskData } from "../../firebase/firebaseService";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";

const LoginForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { hideLogin } = useTimerStore();
  const { setUser } = useAuthStore();

  const handleEmailRegister = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
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
            toast.error("無效的電子郵件格式，請重新檢查");
            break;
          case "auth/weak-password":
            toast.error("密碼過於簡單，請至少輸入 6 個字符");
            break;
          case "auth/email-already-in-use":
            toast.error("此電子郵件已被使用");
            break;
          default:
            toast.error("註冊失敗，請稍後再試");
        }
        console.error("Registration error", error);
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
        switch (error.code) {
          case "auth/user-not-found":
            toast.error("找不到使用者，請檢查帳號或註冊");
            break;
          case "auth/wrong-password":
            toast.error("密碼錯誤，請重新檢查");
            break;
          case "auth/invalid-email":
            toast.error("無效的電子郵件格式，請重新檢查");
            break;
          default:
            toast.error("登入失敗，請稍後再試");
        }
        console.error("Email Login error", error);
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
        console.error("Google Login error", error);
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
        guestPassword
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
        console.error("Guest Login error", error);
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
          })
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
            <CircleUser className="h-5 w-5" />
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
            <Input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
          <div className="flex items-center my-4">
            <Separator className="flex-1" />
            <p className="px-4 text-gray-500">Or continue with</p>
            <Separator className="flex-1" />
          </div>
          <Button variant="outline" onClick={handleGoogleLogin}>
            使用 Google 登入
          </Button>
          <Button variant="outline" onClick={handleGuestLogin}>
            使用 訪客 登入
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
