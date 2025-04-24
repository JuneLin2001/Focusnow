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

const loadTodosFromLocalStorage = () => {
  const storedTodos = localStorage.getItem("todos");
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const saveTodosToLocalStorage = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: loadTodosFromLocalStorage(),
  addTodo: (title) => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      completed: false,
      startTime: Timestamp.now(),
      doneTime: null,
    };

    set((state) => {
      const updatedTodos = [...state.todos, newTodo];
      saveTodosToLocalStorage(updatedTodos);
      return { todos: updatedTodos };
    });
  },
  removeTodo: (id) => {
    set((state) => {
      const updatedTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodosToLocalStorage(updatedTodos);
      return { todos: updatedTodos };
    });
  },
  editTodoTitle: (id, newTitle) => {
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      );
      saveTodosToLocalStorage(updatedTodos);
      return { todos: updatedTodos };
    });
  },
  toggleComplete: (id) => {
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              doneTime: !todo.completed ? Timestamp.now() : null,
            }
          : todo
      );
      saveTodosToLocalStorage(updatedTodos);
      return { todos: updatedTodos };
    });
  },
}));
