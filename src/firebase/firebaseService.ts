import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig"; // 確保這裡的路徑正確
import { User } from "firebase/auth"; // 確保這裡的路徑正確

interface TaskData {
  endTime: Timestamp;
  focusDuration: number;
  pomodoroCompleted: boolean;
  startTime: Timestamp;
}

export async function saveTaskData(user: User, taskData: TaskData) {
  if (!user || !user.uid) {
    console.error("User is not logged in.");
    return;
  }

  try {
    // 取得使用者的 `uid`
    const userId = user.uid;
    console.log("User ID:", userId);

    // 指定 `users` 集合下該使用者的 `analytics` 子集合
    const analyticsCollection = collection(db, `users/${userId}/analytics`);

    // 將 taskData 新增至該使用者的 `analytics` 子集合
    const docRef = await addDoc(analyticsCollection, taskData);

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
