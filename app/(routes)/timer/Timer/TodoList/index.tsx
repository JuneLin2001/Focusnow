import TodoListCard from "./TodoListCard";
import ToggleTodoList from "./ToggleTodoList";

interface TodoListProps {
  isSideBarOpen: boolean;
  toggleSidebar: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  isSideBarOpen,
  toggleSidebar,
}) => {
  return (
    <>
      <ToggleTodoList
        toggleSidebar={toggleSidebar}
        isSideBarOpen={isSideBarOpen}
      />
      <TodoListCard isSideBarOpen={isSideBarOpen} />
    </>
  );
};

export default TodoList;
