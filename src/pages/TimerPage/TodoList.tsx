import { useState } from "react";
import { useTodoStore } from "../../store/todoStore";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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
        className={`fixed top-1/2 left-1/2 w-[90%] sm:w-[500px] h-auto bg-white dark:bg-gray-800 z-30 flex flex-col p-5 outline transition-transform duration-500 ease-in-out transform ${
          isOpen
            ? "scale-100 translate-x-[-50%] translate-y-[-50%] sm:translate-x-[180px]"
            : "scale-0 translate-x-[-50%] translate-y-[-50%]"
        }`}
      >
        <CardTitle className="text-xl mb-4 text-gray-800 dark:text-white">
          Todo List
        </CardTitle>

        <div className="mb-4 flex">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-grow p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="New Todo"
          />
          <Button
            value="add"
            onClick={handleAddTodo}
            className="bg-green-500 dark:bg-green-800 dark:hover:bg-green-900 text-white p-1 ml-2 rounded "
          >
            <Plus />
          </Button>
        </div>

        <ul className="flex-grow overflow-y-auto">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2 ">
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
                className={`flex-grow p-1 text-xl dark:bg-gray-700  ${
                  todo.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-800 dark:text-white"
                }`}
              />
              <Button
                variant="reset"
                onClick={() => removeTodo(todo.id)}
                className="bg-red-500 text-white p-1 ml-2 rounded "
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
};

export default TodoList;
