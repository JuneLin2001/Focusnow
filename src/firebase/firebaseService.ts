import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig"; // 確保這裡的路徑正確
import { User } from "firebase/auth"; // 確保這裡的路徑正確

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  startTime: Timestamp;
  doneTime: Timestamp | null;
}
interface TaskData {
  endTime: Timestamp;
  focusDuration: number;
  pomodoroCompleted: boolean;
  startTime: Timestamp;
  todos: Todo[];
}

export async function saveTaskData(user: User, taskData: TaskData) {
  if (!user || !user.uid) {
    console.error("User is not logged in.");
    return;
  }

  try {
    const userId = user.uid;
    console.log("User ID:", userId);

    const analyticsCollection = collection(db, `users/${userId}/analytics`);
    const docRef = await addDoc(analyticsCollection, taskData);

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
