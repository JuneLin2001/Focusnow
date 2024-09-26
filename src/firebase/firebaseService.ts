import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { User } from "firebase/auth";
import { TaskData } from "../types/type";

interface FirestoreTimestampData {
  seconds: number;
  nanoseconds: number;
}

const convertToTimestamp = (data: FirestoreTimestampData): Timestamp => {
  return Timestamp.fromMillis(
    data.seconds * 1000 + Math.floor(data.nanoseconds / 1000000)
  );
};

export async function saveTaskData(user: User, taskData: TaskData) {
  if (!user || !user.uid) {
    console.error("User is not logged in.");
    return;
  }

  try {
    const userId = user.uid;
    console.log("User ID:", userId);

    const taskDataWithTimestamps: TaskData = {
      ...taskData,
      startTime: convertToTimestamp(taskData.startTime),
      endTime: convertToTimestamp(taskData.endTime),
      todos: taskData.todos.map((todo) => ({
        ...todo,
        startTime: convertToTimestamp(todo.startTime),
        doneTime: todo.doneTime ? convertToTimestamp(todo.doneTime) : null,
      })),
    };

    const analyticsCollection = collection(db, `users/${userId}/analytics`);
    const docRef = await addDoc(analyticsCollection, taskDataWithTimestamps);

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
