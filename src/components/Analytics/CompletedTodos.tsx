import React from "react";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <div className="flex size-full flex-col">
      <div className="justify-between text-center">
        {hasData && (
          <h2 className="mt-4 text-lg font-semibold">
            總共完成了 {completedTodosCount} 個 Todo
          </h2>
        )}
      </div>
      <ScrollArea className="h-full">
        {hasData ? (
          <div className="flex h-[calc(90vh-12rem)] max-w-full flex-col p-4">
            {filteredAnalytics.map((analytics, index) =>
              analytics.todos.length > 0 ? (
                <Card key={index} className="mb-2 flex w-full max-w-full p-4">
                  <div className="space-y-2">
                    {analytics.todos.map((todo) => {
                      const doneTimeDate = todo.doneTime?.seconds
                        ? convertFirestoreTimestampToDate(
                            todo.doneTime.seconds,
                            todo.doneTime.nanoseconds,
                          )
                        : null;

                      return (
                        <div
                          key={todo.id}
                          className="border-b border-gray-300 py-2 last:border-b-0 dark:border-gray-600"
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="w-full max-w-44 truncate text-ellipsis font-semibold text-gray-800 dark:text-white">
                                  {todo.title}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>{todo.title}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {`完成時間：${
                              doneTimeDate
                                ? dayjs(doneTimeDate).format("MM-DD HH:mm")
                                : "載入失敗"
                            }`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : null,
            )}
          </div>
        ) : (
          <div className="flex size-full flex-col justify-center text-center">
            <p className="text-gray-500 dark:text-gray-200">沒有完成的 Todos</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CompletedTodos;
