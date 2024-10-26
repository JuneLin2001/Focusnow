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
import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTimerStore } from "../../store/timerStore";
import { saveTaskData } from "../../firebase/firebaseService";
import useAuthStore from "../../store/authStore";

const LoginForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { hideLogin } = useTimerStore();
  const { setUser } = useAuthStore();

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
      console.error("Google Login error", error);
    }
  };

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
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      hideLogin();
      await saveTaskDataFromLocalStorage(result.user);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Email Login error", error);
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
            <input
              type="email"
              placeholder="電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <DialogFooter>
            <Button
              variant="default"
              onClick={isRegistering ? handleEmailRegister : handleEmailLogin}
            >
              {isRegistering ? "註冊" : "登入"}
            </Button>
            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "已有帳戶？登入" : "還沒有帳戶？註冊"}
            </Button>
            <Button variant="outline" onClick={handleGoogleLogin}>
              使用 Google 登入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
