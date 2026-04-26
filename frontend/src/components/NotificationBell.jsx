import React, { useEffect, useState } from "react";
import { Badge, Dropdown, List } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { socket } from "../services/socket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("task_assigned", (data) => {
      const newNoti = {
        id: Date.now(),
        message: `Bạn được assign task #${data.taskId}`,
      };

      setNotifications((prev) => [newNoti, ...prev]);
    });

    return () => {
      socket.off("task_assigned");
    };
  }, []);

  const items = [
    {
      key: "noti",
      label: (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item>{item.message}</List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Badge count={notifications.length}>
        <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;