import { useState } from "react";
import { useTodoStore } from "../../store/todoStore";
import { Card, CardTitle } from "@/components/ui/card";

const TodoList = ({ isOpen }: { isOpen: boolean }) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");

  const { todos, addTodo, removeTodo, editTodoTitle, toggleComplete } =
    useTodoStore();

  const handleAddTodo = () => {
    if (newTodoTitle.trim() === "") return;
    addTodo(newTodoTitle);
    setNewTodoTitle("");
  };

  return (
    <>
      <Card
        className={`fixed top-1/2 left-1/2 w-[90%] sm:w-[500px] h-auto bg-white z-10 flex flex-col p-5 outline transition-transform duration-500 ease-in-out transform ${
          isOpen
            ? "scale-100 translate-x-[-50%] translate-y-[-50%] sm:translate-x-[250px]" // 冒出後在手機上居中，桌面版向右移動
            : "scale-0 translate-x-[-50%] translate-y-[-50%]" // 初始狀態縮小並居中
        }`}
      >
        <CardTitle className="text-xl mb-4">Todo List</CardTitle>

        <div className="mb-4 flex">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="New Todo"
          />
          <button
            onClick={handleAddTodo}
            className="bg-green-500 text-white p-2 ml-2 rounded"
          >
            +
          </button>
        </div>

        <ul className="flex-grow overflow-y-auto">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-2 w-6 h-6"
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => editTodoTitle(todo.id, e.target.value)}
                className={`flex-grow p-1 ${
                  todo.completed ? "line-through text-gray-500" : ""
                } text-xl`}
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
      </Card>
    </>
  );
};

export default TodoList;
