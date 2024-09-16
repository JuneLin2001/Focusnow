import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig"; // 確保這裡的路徑正確

interface TaskData {
  endTime: Timestamp;
  focusDuration: number;
  pomodoroCompleted: boolean;
  startTime: Timestamp;
}

export async function saveTaskData(taskData: TaskData) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
