import { create } from "zustand";
import { Timestamp } from "firebase/firestore";

interface Todo {
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
          id: Date.now().toString(), // 使用字串作為 ID
          title,
          completed: false,
          startTime: Timestamp.now(),
          doneTime: null, // 尚未完成，設為 null
        },
      ],
    }));
  },
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id), // 根據 ID 過濾待辦事項
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
              doneTime: !todo.completed ? Timestamp.now() : null, // 完成時設為當前時間戳，未完成時設為 null
            }
          : todo
      ),
    }));
  },
}));
