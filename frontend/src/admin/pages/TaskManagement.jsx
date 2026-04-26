import React, { useEffect, useState } from "react";
import {
  Table, Button, Space, Card, Modal, Form, Input, Select,
  DatePicker, message, Tag, Popconfirm, Tabs, Avatar, Tooltip
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { taskService } from "../../services/taskService";
import { projectService } from "../../services/projectService";
import { userService } from "../../services/userService";
import TaskKanban from "./TaskKanban";

const TaskManagement = () => {
  const [form] = Form.useForm();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  // ===== OVERDUE =====
  const isOverdue = (task) => {
    if (!task.end_date) return false;
    return dayjs(task.end_date).isBefore(dayjs(), "day") && task.status !== "done";
  };

  // ===== INIT =====
  const initData = async () => {
    setLoading(true);
    try {
      const [taskRes, projRes, userRes] = await Promise.all([
        taskService.getList(),
        projectService.getList(),
        userService.getList(),
      ]);

      setTasks(taskRes.data?.data || []);
      setProjects(projRes.data?.data || []);
      setUsers(userRes.data?.data || []);
    } catch {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
console.log("tasks", tasks);
  useEffect(() => { initData(); }, []);

  // ===== ACTION =====
  const handleOpenAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingId(record.id);

    form.setFieldsValue({
      ...record,
      range_date: [
        record.start_date ? dayjs(record.start_date) : null,
        record.end_date ? dayjs(record.end_date) : null,
      ],
      project_id: record.project?.id,
      user_ids: record.assigned_users?.map(u => u.id) || [],
    });

    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        project_id: values.project_id,
        status: values.status,
        priority: values.priority,
        start_date: values.range_date?.[0]?.format("YYYY-MM-DD"),
        end_date: values.range_date?.[1]?.format("YYYY-MM-DD"),
      };

      let taskId = editingId;

      if (editingId) {
        await taskService.update(editingId, payload);
        message.success("Cập nhật task thành công");
      } else {
        const res = await taskService.create(payload);
        taskId = res.data?.data?.id;
        message.success("Tạo task thành công");
      }

      if (values.user_ids?.length) {
        for (let uid of values.user_ids) {
          await taskService.assign(taskId, uid);
        }
      }

      setIsModalOpen(false);
      initData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await taskService.delete(id);
    message.success("Đã xóa");
    initData();
  };

  // ===== TABLE =====
  const columns = [
    {
      title: "Tên task",
      render: (_, r) => (
        <span style={{
          color: isOverdue(r) ? "#ff4d4f" : undefined,
          fontWeight: isOverdue(r) ? 600 : undefined
        }}>
          {r.title}
        </span>
      ),
    },
    {
      title: "Dự án",
      render: (_, r) => r.project?.name,
    },
    {
      title: "Người thực hiện",
      render: (_, r) => (
        <Avatar.Group max={{count: 3, overflow: "tooltip"}}>
          {r.assigned_users?.slice(0, 3).map(u => (
            <Tooltip key={u.id} title={u.full_name}>
              <Avatar src={u.avatar}>
                {u.full_name?.[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Deadline",
      render: (_, r) => (
        <span style={{ color: isOverdue(r) ? "#ff4d4f" : undefined }}>
          {r.end_date ? dayjs(r.end_date).format("DD/MM/YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      render: (_, r) => (
        <>
          <Tag color={
            r.status === "done" ? "green" :
            r.status === "doing" ? "blue" : "default"
          }>
            {r.status}
          </Tag>
          {isOverdue(r) && <Tag color="red">Overdue</Tag>}
        </>
      ),
    },
    {
      title: "Thao tác",
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(r)} />
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(r.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý Task"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Thêm Task
        </Button>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "1",
            label: "Danh sách",
            children: (
              <>
                <Input
                  placeholder="Tìm task..."
                  prefix={<SearchOutlined />}
                  style={{ width: 300, marginBottom: 16 }}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <Table
                  columns={columns}
                  dataSource={
                    Array.isArray(tasks)
                      ? tasks.filter(t =>
                          t.title?.toLowerCase().includes(searchText.toLowerCase())
                        )
                      : []
                  }
                  rowKey="id"
                  loading={loading}
                  rowClassName={(record) =>
                    isOverdue(record) ? "row-overdue" : ""
                  }
                />
              </>
            ),
          },
          {
            key: "2",
            label: "Kanban",
            children: <TaskKanban />,
          },
        ]}
      />

      {/* MODAL */}
      <Modal
        title={editingId ? "Cập nhật Task" : "Tạo Task"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Tên task" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="project_id" label="Dự án" rules={[{ required: true }]}>
            <Select>
              {projects.map(p => (
                <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="user_ids" label="Người thực hiện">
            <Select mode="multiple">
              {users.map(u => (
                <Select.Option key={u.id} value={u.id}>
                  {u.profile?.full_name || u.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="range_date" label="Thời gian">
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="priority" initialValue="medium">
            <Select>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" initialValue="todo">
            <Select>
              <Select.Option value="todo">Todo</Select.Option>
              <Select.Option value="doing">Doing</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TaskManagement;