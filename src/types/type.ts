// src/types/types.ts

import { Timestamp } from "firebase/firestore";

export interface Todos {
  completed: boolean;
  doneTime: Timestamp;
  id: string;
  startTime: Timestamp;
  title: string;
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
