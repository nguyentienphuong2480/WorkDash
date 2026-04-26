import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Pie, Column } from "@ant-design/plots";
import { socket } from "../../services/socket";

import { userService } from "../../services/userService";
import { projectService } from "../../services/projectService";
import { taskService } from "../../services/taskService";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    tasks: 0,
    attendance: 0,
  });

  const [taskChart, setTaskChart] = useState([]);
  const [projectChart, setProjectChart] = useState([]);

  const initData = async () => {
    setLoading(true);
    try {
      const [userRes, projectRes, taskRes] = await Promise.all([
        userService.getList(),
        projectService.getList(),
        taskService.getList(),
      ]);

      const users = userRes.data?.data || [];
      const projects = projectRes.data?.data || [];
      const tasks = taskRes.data?.data || [];

      setStats({
        users: users.length,
        projects: projects.length,
        tasks: tasks.length,
        attendance: 0,
      });

      const taskMap = {};
      tasks.forEach((t) => {
        taskMap[t.status] = (taskMap[t.status] || 0) + 1;
      });

      setTaskChart(
        Object.keys(taskMap).map((k) => ({ type: k, value: taskMap[k] }))
      );

      const projMap = {};
      projects.forEach((p) => {
        projMap[p.status] = (projMap[p.status] || 0) + 1;
      });

      setProjectChart(
        Object.keys(projMap).map((k) => ({ type: k, value: projMap[k] }))
      );

    } finally {
      setLoading(false);
    }
  };

  // 👉 load lần đầu
  useEffect(() => {
    initData();
  }, []);

  // 👉 realtime
  useEffect(() => {
    socket.on("task_created", initData);
    socket.on("task_updated", initData);
    socket.on("task_assigned", initData);

    return () => {
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_assigned");
    };
  }, []);

  if (loading) return <Spin fullscreen />;

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Users" value={stats.users} prefix={<UserOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Projects" value={stats.projects} prefix={<ProjectOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Tasks" value={stats.tasks} prefix={<CheckSquareOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Attendance" value={stats.attendance} prefix={<CalendarOutlined />} /></Card></Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}><Card title="Task"><Pie data={taskChart} angleField="value" colorField="type" /></Card></Col>
        <Col span={12}><Card title="Project"><Column data={projectChart} xField="type" yField="value" /></Card></Col>
      </Row>
    </div>
  );
};

export default Dashboard;