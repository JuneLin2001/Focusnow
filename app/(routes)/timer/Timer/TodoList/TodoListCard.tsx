import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TodoListCardProps {
  isSideBarOpen: boolean;
}

const TodoListCard: React.FC<TodoListCardProps> = ({ isSideBarOpen }) => {
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
      id="todo-list"
      className={`bg-opacity-60 fixed top-1/2 left-1/2 z-30 flex h-[500px] w-screen max-w-[500px] transform flex-col bg-white p-5 transition-all duration-500 ease-in-out lg:z-0 lg:max-w-[350px] ${
        isSideBarOpen
          ? "translate-y-[-250px] opacity-100 lg:translate-x-[250px] lg:-translate-y-1/2"
          : "translate-y-[-1050px] opacity-0 lg:-translate-y-1/2"
      } -translate-x-1/2`}
    >
      <CardTitle className="mb-4 text-xl text-gray-800 dark:text-white">
        Todo List
      </CardTitle>

      <div id="new-todo" className="mb-4 flex w-full">
        <Input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
          className="grow overflow-hidden rounded border p-2 text-ellipsis whitespace-nowrap dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

      <ul className="w-full grow overflow-y-auto">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} className="mb-2 flex w-full items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-2 size-6"
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => editTodoTitle(todo.id, e.target.value)}
                className={`bg-opacity-0 w-full grow bg-white p-1 text-xl leading-5 ${
                  todo.completed
                    ? "text-gray-500 line-through dark:text-gray-400"
                    : "text-gray-800 dark:text-white"
                } overflow-hidden text-ellipsis whitespace-nowrap`}
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

export default TodoListCard;
