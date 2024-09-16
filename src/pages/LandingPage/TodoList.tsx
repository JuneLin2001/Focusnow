import { useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoList = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");

  // 切換 sidebar 開關
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // 新增 todo 項目
  const addTodo = () => {
    if (newTodoTitle.trim() === "") return; // 避免空白的 todo
    const newTodo: Todo = {
      id: Date.now(),
      title: newTodoTitle,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoTitle(""); // 清空輸入框
  };

  // 刪除完成的 todo 項目
  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 編輯 todo 標題
  const editTodoTitle = (id: number, newTitle: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );
  };

  // 切換 todo 的完成狀態
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="relative flex">
      <button
        onClick={toggleSidebar}
        className="absolute bottom-4 right-4 z-20 bg-blue-500 text-white p-2 rounded"
      >
        {isOpen ? "Close" : "Open"}
      </button>

      <div
        className={`fixed bottom-0 right-0 w-[300px] h-[600px] bg-white z-10 flex flex-col p-5 outline transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-[580px]"
        }`}
      >
        <h2 className="text-xl mb-4">Todo List</h2>

        {/* 輸入框和新增按鈕 */}
        <div className="mb-4 flex">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="New Todo"
          />
          <button
            onClick={addTodo}
            className="bg-green-500 text-white p-2 ml-2 rounded"
          >
            +
          </button>
        </div>

        {/* Todo 列表 */}
        <ul className="flex-grow overflow-y-auto">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-2"
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => editTodoTitle(todo.id, e.target.value)}
                className={`flex-grow p-1 ${todo.completed ? "line-through text-gray-500" : ""}`}
              />
              <button
                onClick={() => removeTodo(todo.id)}
                className="bg-red-500 text-white p-1 ml-2 rounded"
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
