import React from "react";
import { UserAnalytics } from "../../types/type";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import dayjs from "dayjs";

interface CompletedTodosProps {
  filteredAnalytics: UserAnalytics[];
}

const CompletedTodos: React.FC<CompletedTodosProps> = ({
  filteredAnalytics,
}) => {
  return (
    <>
      <List>
        {filteredAnalytics.length > 0 &&
          filteredAnalytics.map((analytics, index) => {
            if (analytics.todos.length > 0) {
              return (
                <ListItem
                  key={index}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginBottom: "8px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <ListItemText>
                    <List>
                      {analytics.todos.map((todo) => (
                        <ListItem key={todo.id} sx={{ padding: "4px 16px" }}>
                          <ListItemText
                            primary={todo.title}
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {`完成時間：
                                ${
                                  todo.doneTime
                                    ? dayjs(todo.doneTime.toDate()).format(
                                        "MM-DD HH:mm"
                                      )
                                    : "error"
                                }`}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </ListItemText>
                </ListItem>
              );
            }
            return null;
          })}
      </List>
    </>
  );
};

export default CompletedTodos;
