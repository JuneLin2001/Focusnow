import { create } from "zustand";
import { Timestamp } from "firebase/firestore";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  startTime: Timestamp;
  doneTime: Timestamp | null;
}

interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
  removeTodo: (id: string) => void;
  editTodoTitle: (id: string, newTitle: string) => void;
  toggleComplete: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  addTodo: (title) => {
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          title,
          completed: false,
          startTime: Timestamp.now(),
          doneTime: null,
        },
      ],
    }));
  },
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },
  editTodoTitle: (id, newTitle) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      ),
    }));
  },
  toggleComplete: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              doneTime: !todo.completed ? Timestamp.now() : null,
            }
          : todo
      ),
    }));
  },
}));
