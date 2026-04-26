import React, { useEffect, useState } from "react";
import { Card, Tag, Avatar } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import dayjs from "dayjs";
import { taskService } from "../../services/taskService";

const columns = [
  { key: "todo", title: "Todo" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
];

const TaskKanban = () => {
  const [tasks, setTasks] = useState([]);

  const isOverdue = (task) => {
    if (!task.end_date) return false;
    return dayjs(task.end_date).isBefore(dayjs(), "day") && task.status !== "done";
  };

  const initData = async () => {
    const res = await taskService.getList();
    setTasks(res.data?.data || []);
  };

  useEffect(() => { initData(); }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    await taskService.update(draggableId, {
      status: destination.droppableId,
    });

    setTasks(prev =>
      prev.map(t =>
        t.id.toString() === draggableId
          ? { ...t, status: destination.droppableId }
          : t
      )
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: 16 }}>
        {columns.map(col => (
          <Droppable droppableId={col.key} key={col.key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width: "33%",
                  background: "#f5f5f5",
                  padding: 10,
                  borderRadius: 8,
                  minHeight: 500,
                }}
              >
                <h3>{col.title}</h3>

                {tasks
                  .filter(t => t.status === col.key)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          size="small"
                          style={{
                            marginBottom: 10,
                            border: isOverdue(task) ? "1px solid #ff4d4f" : undefined,
                            background: isOverdue(task) ? "#fff1f0" : undefined,
                          }}
                        >
                          <b>{task.title}</b>

                          <div style={{ marginTop: 6 }}>
                            <Tag color={
                              task.priority === "high" ? "red" :
                              task.priority === "medium" ? "orange" : "blue"
                            }>
                              {task.priority}
                            </Tag>
                            {isOverdue(task) && <Tag color="red">Overdue</Tag>}
                          </div>

                          <div style={{ fontSize: 12 }}>
                            📅 {task.end_date ? dayjs(task.end_date).format("DD/MM") : "-"}
                          </div>

                          <Avatar.Group size="small">
                            {task.assigned_users?.map(u => (
                              <Avatar key={u.id} src={u.avatar}>
                                {u.name?.[0]}
                              </Avatar>
                            ))}
                          </Avatar.Group>
                        </Card>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskKanban;