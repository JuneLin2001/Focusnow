import { useState } from "react";
import { useTodoStore } from "../../store/todoStore";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const TodoList = ({ isOpen }: { isOpen: boolean }) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { todos, addTodo, removeTodo, editTodoTitle, toggleComplete } =
    useTodoStore();

  const handleAddTodo = () => {
    if (newTodoTitle.trim() === "") {
      setErrorMessage("請輸入Todo的標題。");
      return;
    }

    addTodo(newTodoTitle);
    setNewTodoTitle("");
    setErrorMessage("");
  };

  return (
    <Card
      className={`fixed left-1/2 top-1/2 z-30 flex h-[500px] w-screen max-w-[500px] transform flex-col bg-white bg-opacity-60 p-5 transition-all duration-500 ease-in-out lg:z-0 lg:max-w-[350px] ${
        isOpen
          ? "translate-y-[-1050px] opacity-0 lg:translate-y-[-50%]"
          : "translate-y-[-250px] opacity-100 lg:translate-x-[250px] lg:translate-y-[-50%]"
      } translate-x-[-50%]`}
    >
      <CardTitle className="mb-4 text-xl text-gray-800 dark:text-white">
        Todo List
      </CardTitle>

      <div className="mb-4 flex w-full">
        <Input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder={errorMessage ? errorMessage : "New Todo"}
        />
        <Button
          variant="add"
          className="ml-2 rounded p-1"
          onClick={handleAddTodo}
        >
          <Plus />
        </Button>
      </div>

      <ul className="w-full flex-grow overflow-y-auto">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} className="mb-2 flex w-full items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-2 h-6 w-6"
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => editTodoTitle(todo.id, e.target.value)}
                className={`w-full flex-grow bg-white bg-opacity-0 p-1 text-xl leading-5 ${
                  todo.completed
                    ? "text-gray-500 line-through dark:text-gray-400"
                    : "text-gray-800 dark:text-white"
                } overflow-hidden overflow-ellipsis whitespace-nowrap`}
              />
              <Button
                variant="reset"
                onClick={() => removeTodo(todo.id)}
                className="ml-2 rounded p-1"
              >
                <Trash2 />
              </Button>
            </li>
          ))
        ) : (
          <li className="text-center dark:text-gray-200">沒有Todos</li>
        )}
      </ul>
    </Card>
  );
};

export default TodoList;
