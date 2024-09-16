import { create } from "zustand";
import { Timestamp, doc, deleteDoc } from "firebase/firestore";
import { User } from "firebase/auth"; // 確保這裡的路徑正確
import { db } from "../firebase/firebaseConfig"; // 確保這裡的路徑正確

// 定義 Todo 型別
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
  saveCompletedTodos: (user: User) => Promise<void>;
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
  saveCompletedTodos: async (user: User) => {
    try {
      const completedTodos = useTodoStore
        .getState()
        .todos.filter((todo) => todo.completed);

      await Promise.all(
        completedTodos.map(async (todo) => {
          const todoRef = doc(db, `users/${user.uid}/analytics/${todo.id}`);
          await deleteDoc(todoRef);
        })
      );

      set((state) => ({
        todos: state.todos.filter((todo) => !todo.completed),
      }));

      console.log("Completed todos saved and removed successfully");
    } catch (error) {
      console.error("Error saving or removing completed todos: ", error);
    }
  },
}));
