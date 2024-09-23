import Timer from "./Timer.js";
import TodoList from "./TodoList.js";

const TimerPage = () => {
  return (
    // TODO:Timer的背景樣式
    <div className="z-30">
      <Timer />
      <TodoList />
    </div>
  );
};

export default TimerPage;
