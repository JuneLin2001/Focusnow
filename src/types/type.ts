// src/types/types.ts

import { Timestamp } from "firebase/firestore";

export interface Todos {
  id: string;
  title: string;
  completed: boolean;
  startTime: Timestamp;
  doneTime: Timestamp | null;
}

export interface UserAnalytics {
  focusDuration: number;
  pomodoroCompleted: boolean;
  startTime: Timestamp;
  endTime: Timestamp;
  todos: Todos[];
}

export interface ModelProps {
  position: [number, number, number];
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface TaskData {
  endTime: Timestamp;
  focusDuration: number;
  pomodoroCompleted: boolean;
  startTime: Timestamp;
  todos: Todos[];
}
