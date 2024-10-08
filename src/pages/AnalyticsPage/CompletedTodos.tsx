import React from "react";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";

interface CompletedTodosProps {
  filteredAnalytics: UserAnalytics[];
}

const CompletedTodos: React.FC<CompletedTodosProps> = ({
  filteredAnalytics,
}) => {
  const completedTodosCount = filteredAnalytics.reduce(
    (acc, analytics) => acc + analytics.todos.length,
    0
  );

  const hasData = completedTodosCount > 0;

  return (
    <div className="h-full max-h-[66vh] overflow-y-auto">
      {hasData ? (
        <>
          <h2 className="font-semibold mb-2 text-gray-800 dark:text-white">
            總共完成了: {completedTodosCount} 個 Todo
          </h2>
          {filteredAnalytics.map((analytics, index) => {
            if (analytics.todos.length > 0) {
              return (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg mb-2 bg-gray-100 dark:bg-gray-700 p-4"
                >
                  <div className="space-y-2">
                    {analytics.todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="border-b border-gray-300 dark:border-gray-600 py-2 last:border-b-0"
                      >
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {todo.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {`完成時間：${
                            todo.doneTime
                              ? dayjs(todo.doneTime.toDate()).format(
                                  "MM-DD HH:mm"
                                )
                              : "error"
                          }`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </>
      ) : (
        <div className="w-full h-full flex-1 flex justify-center items-center">
          <p className="text-gray-500 text-center">沒有完成的 Todos</p>
        </div>
      )}
    </div>
  );
};

export default CompletedTodos;
