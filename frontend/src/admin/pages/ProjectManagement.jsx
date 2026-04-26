import React, { useEffect, useState } from 'react';
import {
  Table, Tag, Button, Space, Card, Modal, Form, Tabs, Avatar,
  Input, DatePicker, Select, Popconfirm, message, Tooltip, Divider
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined,
  SearchOutlined, FolderOpenOutlined, ReloadOutlined, RestOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';
import { hasRole } from '../../utils/permission';

const ProjectManagement = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  // ===== DATA =====
  const [projects, setProjects] = useState([]);
  const [deletedProjects, setDeletedProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // ===== MODAL =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ===== DETAIL =====
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // ===== INIT =====
  const initData = async () => {
    setLoading(true);
    try {
      const [projRes, recycleRes, userRes] = await Promise.all([
        projectService.getList(),
        projectService.getRecycleBin(),
        userService.getList(),
      ]);

      setProjects(projRes.data?.data || []);
      setDeletedProjects(recycleRes.data?.data || []);
      setUsers(userRes.data?.data || []);
    } catch {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

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
      manager_id: record.manager?.id,
      member_ids: record.members?.map(m => m.id) || [],
    });

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        start_date: values.range_date[0].format('YYYY-MM-DD'),
        end_date: values.range_date[1].format('YYYY-MM-DD'),
        manager_id: values.manager_id,
        status: values.status,
        member_ids: values.member_ids || [],
      };

      if (editingId) {
        await projectService.update(editingId, payload);
        message.success("Cập nhật thành công");
      } else {
        await projectService.create(payload);
        message.success("Tạo dự án thành công");
      }

      setIsModalOpen(false);
      initData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi");
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id) => {
    await projectService.softDelete(id);
    message.success("Đã chuyển vào thùng rác");
    initData();
  };

  const handleRestore = async (id) => {
    await projectService.restore(id);
    message.success("Khôi phục thành công");
    initData();
  };

  // ===== TABLE =====
  const mainColumns = [
    {
      title: 'Tên dự án',
      render: (_, r) => (
        <Space>
          <FolderOpenOutlined style={{ color: '#1890ff' }} />
          <b>{r.name}</b>
        </Space>
      ),
    },
    {
      title: 'Manager',
      render: (_, r) => (
        <Space>
          <Avatar src={r.manager?.profile?.avatar} icon={<UserOutlined />} />
          {r.manager?.profile?.full_name || r.manager?.username}
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      render: (_, r) => (
        <>
          <CalendarOutlined />{" "}
          {dayjs(r.start_date).format('DD/MM/YYYY')} - {dayjs(r.end_date).format('DD/MM/YYYY')}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      render: (_, r) => (
        <Tag color={r.status === 'completed' ? 'green' : 'blue'}>
          {r.status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(r)} />
          <Popconfirm title="Xóa?" onConfirm={() => handleSoftDelete(r.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const recycleColumns = [
    { title: 'Tên', dataIndex: 'name' },
    {
      title: 'Ngày xóa',
      dataIndex: 'deleted_at',
      render: d => dayjs(d).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      render: (_, r) => (
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => handleRestore(r.id)}>
            Khôi phục
          </Button>
          <Popconfirm title="Xóa vĩnh viễn?" onConfirm={() => projectService.forceDelete(r.id).then(initData)}>
            <Button danger icon={<RestOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý dự án"
      extra={hasRole("admin","manager") && (<Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>Thêm</Button>)}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: 'Danh sách',
            children: (
              <>
                <Input
                  placeholder="Tìm dự án..."
                  prefix={<SearchOutlined />}
                  style={{ width: 300, marginBottom: 16 }}
                  onChange={e => setSearchText(e.target.value)}
                />

                <Table
                  columns={mainColumns}
                  dataSource={Array.isArray(projects)
                    ? projects.filter(p => p.name?.toLowerCase().includes(searchText.toLowerCase()))
                    : []}
                  rowKey="id"
                  loading={loading}
                  onRow={(record) => ({
                    onClick: (e) => {
                      if (e.target.closest('button')) return;
                      setSelectedProject(record);
                      setIsDetailOpen(true);
                    },
                  })}
                />
              </>
            ),
          },
          {
            key: '2',
            label: `Thùng rác (${deletedProjects.length})`,
            children: <Table columns={recycleColumns} dataSource={deletedProjects} rowKey="id" />,
          },
        ]}
      />

      {/* ===== MODAL FORM ===== */}
      <Modal
        title={editingId ? "Cập nhật dự án" : "Tạo dự án"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Tên dự án" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="range_date" label="Thời gian" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="manager_id" label="Manager" rules={[{ required: true }]}>
            <Select showSearch>
              {users.map(u => (
                <Select.Option key={u.id} value={u.id}>
                  {u.profile?.full_name || u.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="member_ids" label="Thành viên">
            <Select mode="multiple" showSearch>
              {users.map(u => (
                <Select.Option key={u.id} value={u.id}>
                  {u.profile?.full_name || u.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" initialValue="planning">
            <Select>
              <Select.Option value="planning">Planning</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== DETAIL ===== */}
      <Modal
        title="Chi tiết dự án"
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={null}
      >
        {selectedProject && (
          <>
            <h3>{selectedProject.name}</h3>
            <Divider />

            <p><b>Manager:</b> {selectedProject.manager?.profile?.full_name}</p>

            <p>
              {dayjs(selectedProject.start_date).format('DD/MM/YYYY')} -{" "}
              {dayjs(selectedProject.end_date).format('DD/MM/YYYY')}
            </p>

            <Divider />

            <b>Thành viên:</b>
            <Space>
              {selectedProject.members?.map(m => (
                <Tooltip key={m.id} title={m.profile?.full_name}>
                  <Avatar src={m.profile?.avatar}>
                    {m.username?.[0]}
                  </Avatar>
                </Tooltip>
              ))}
            </Space>
          </>
        )}
      </Modal>
    </Card>
  );
};

export default ProjectManagement;