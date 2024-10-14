import { useState } from "react";
import { useTodoStore } from "../../store/todoStore";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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
      className={`fixed top-1/2 left-1/2 h-[450px] lg:h-[500px] lg:w-[300px] max-w-[500px] flex flex-col p-5 transition-all duration-500 ease-in-out transform z-30 lg:z-0 
      ${
        isOpen
          ? "translate-y-[-1050px] lg:translate-y-[-50%] opacity-0"
          : "translate-y-[-200px] lg:translate-x-[250px] lg:translate-y-[-50%] opacity-100"
      }
      translate-x-[-50%]`}
    >
      <CardTitle className="text-xl mb-4 text-gray-800 dark:text-white">
        Todo List
      </CardTitle>

      <div className="mb-4 flex w-full">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="flex-grow p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder={errorMessage ? errorMessage : "New Todo"}
        />
        <Button
          variant="add"
          className="p-1 ml-2 rounded"
          onClick={handleAddTodo}
        >
          <Plus />
        </Button>
      </div>

      <ul className="flex-grow overflow-y-auto w-full">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2 w-full">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-2 w-6 h-6 "
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => editTodoTitle(todo.id, e.target.value)}
                className={`flex-grow p-1 text-xl leading-5	w-full bg-white bg-opacity-0 ${
                  todo.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-800 dark:text-white"
                }`}
              />
              <Button
                variant="reset"
                onClick={() => removeTodo(todo.id)}
                className="p-1 ml-2 rounded"
              >
                <Trash2 />
              </Button>
            </li>
          ))
        ) : (
          <li className="dark:text-gray-200 text-center">沒有待辦事項</li>
        )}
      </ul>
    </Card>
  );
};

export default TodoList;
