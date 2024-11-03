import React from "react";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompletedTodosProps {
  filteredAnalytics: UserAnalytics[];
}

const convertFirestoreTimestampToDate = (
  seconds: number,
  nanoseconds: number,
): Date => {
  return new Date(seconds * 1000 + Math.floor(nanoseconds / 1000000));
};

const CompletedTodos: React.FC<CompletedTodosProps> = ({
  filteredAnalytics,
}) => {
  const completedTodosCount = filteredAnalytics.reduce(
    (acc, analytics) => acc + analytics.todos.length,
    0,
  );

  const hasData = completedTodosCount > 0;

  return (
    <>
      {hasData && (
        <h2 className="mb-2 pb-2 font-semibold text-gray-800 dark:text-white">
          總共完成了 {completedTodosCount} 個 Todo
        </h2>
      )}
      <ScrollArea
        className={`${hasData ? "max-h-[35vh] lg:max-h-[55vh]" : "max-h-screen"} h-full`}
      >
        {hasData ? (
          <>
            {filteredAnalytics.map((analytics, index) => {
              if (analytics.todos.length > 0) {
                return (
                  <Card
                    key={index}
                    className="mb-4 rounded-lg border border-gray-300 bg-gray-100 p-4 dark:bg-gray-500"
                  >
                    <div className="space-y-2">
                      {analytics.todos.map((todo) => {
                        const doneTime = todo.doneTime;
                        const doneTimeDate =
                          doneTime &&
                          doneTime.seconds !== undefined &&
                          doneTime.nanoseconds !== undefined
                            ? convertFirestoreTimestampToDate(
                                doneTime.seconds,
                                doneTime.nanoseconds,
                              )
                            : null;

                        return (
                          <div
                            key={todo.id}
                            className="border-b border-gray-300 py-2 last:border-b-0 dark:border-gray-600"
                          >
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {todo.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {`完成時間：${
                                doneTimeDate
                                  ? dayjs(doneTimeDate).format("MM-DD HH:mm")
                                  : "未完成"
                              }`}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              }
              return null;
            })}
          </>
        ) : (
          <div className="flex size-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-200">沒有完成的 Todos</p>
          </div>
        )}
      </ScrollArea>
    </>
  );
};

export default CompletedTodos;
