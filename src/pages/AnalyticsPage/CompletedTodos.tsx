// CompletedTodos.tsx
import React from "react";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";

interface CompletedTodosProps {
  filteredAnalytics: UserAnalytics[];
}

const CompletedTodos: React.FC<CompletedTodosProps> = ({
  filteredAnalytics,
}) => {
  // 計算總共完成的 Todo 數量
  const completedTodosCount = filteredAnalytics.reduce(
    (acc, analytics) => acc + analytics.todos.length,
    0
  );

  return (
    <div className="h-full overflow-y-auto">
      {/* 設定高度並添加滾動條 */}
      <h2 className="font-semibold mb-2">
        總共完成了: {completedTodosCount} 個 Todo
      </h2>
      {filteredAnalytics.length > 0 &&
        filteredAnalytics.map((analytics, index) => {
          if (analytics.todos.length > 0) {
            return (
              <div
                key={index}
                className="border border-gray-300 rounded-lg mb-2 bg-gray-100 p-4"
              >
                <div className="space-y-2">
                  {analytics.todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="border-b border-gray-300 py-2 last:border-b-0"
                    >
                      <h3 className="font-semibold">{todo.title}</h3>
                      <p className="text-gray-600 text-sm">
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
    </div>
  );
};

export default CompletedTodos;
