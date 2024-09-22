import React from "react";
import { UserAnalytics } from "../../types/type"; // 確保這裡的路徑正確

interface CompletedTodosProps {
  filteredAnalytics: UserAnalytics[];
}

const CompletedTodos: React.FC<CompletedTodosProps> = ({
  filteredAnalytics,
}) => {
  return (
    <>
      <h3>Completed Todos:</h3>
      <ul>
        {filteredAnalytics.length > 0 ? (
          filteredAnalytics.map((analytics, index) => (
            <li key={index}>
              <ul>
                {analytics.todos.length > 0 ? (
                  analytics.todos.map((todo) => (
                    <li key={todo.id}>{todo.title}</li>
                  ))
                ) : (
                  <li>沒有待辦事項</li>
                )}
              </ul>
            </li>
          ))
        ) : (
          <p>找不到資料：（</p>
        )}
      </ul>
    </>
  );
};

export default CompletedTodos;
