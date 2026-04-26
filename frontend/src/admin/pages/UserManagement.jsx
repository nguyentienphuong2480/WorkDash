import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Switch,
  Button,
  Avatar,
  Space,
  message,
  Card,
  Modal,
  Descriptions,
  Tabs,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  Select,
  Divider,
} from "antd";
import {
  EyeOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined,
  RestOutlined,
  ReloadOutlined,
  WarningOutlined,
  PlusOutlined,
  LogoutOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { userService } from "../../services/userService";
import { roleService } from "../../services/roleService";

const UserManagement = () => {
  const [form] = Form.useForm();

  // --- States dữ liệu ---
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- States tìm kiếm & Lọc ---
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState(null);

  // --- States Modals ---
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 1. Tải dữ liệu ban đầu (Đồng bộ danh sách, thùng rác và vai trò)
  const initData = async () => {
    setLoading(true);
    try {
      const [userRes, recycleRes, roleRes] = await Promise.all([
        userService.getList(),
        userService.recycleBin(),
        roleService.getAll(),
      ]);
      setUsers(userRes.data?.data || userRes.data || []);
      setDeletedUsers(recycleRes.data?.data || recycleRes.data || []);
      setRoles(roleRes.data?.data || roleRes.data || []);
    } catch (error) {
      message.error("Không thể tải dữ liệu từ hệ thống");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  // --- XỬ LÝ LOGIC TÌM KIẾM & LỌC ---
  const filteredUsers = users.filter((user) => {
    const fullName = user.profile?.full_name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const search = searchText.toLowerCase();
    const matchesSearch = fullName.includes(search) || email.includes(search);
    const matchesRole = filterRole ? user.role_id === filterRole : true;
    return matchesSearch && matchesRole;
  });

  // --- XỬ LÝ HÀNH ĐỘNG (CRUD) ---

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingId) {
        await userService.update(editingId, values);
        message.success("Cập nhật thông tin thành công");
      } else {
        await userService.create(values);
        message.success("Thêm nhân viên mới thành công");
      }
      setIsFormModalOpen(false);
      initData();
    } catch (error) {
      message.error(error.response?.data?.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (checked, id) => {
    const originalUsers = [...users];
    // Cập nhật UI ngay lập tức (Optimistic Update)
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_active: checked } : u)),
    );
    try {
      await userService.updateStatus(id, checked);
      message.success("Đã cập nhật trạng thái");
    } catch (error) {
      setUsers(originalUsers); // Rollback nếu lỗi
      message.error("Lỗi cập nhật trạng thái");
      console.error(error);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      await userService.delete(id);
      message.success("Đã chuyển vào thùng rác");
      initData();
    } catch (error) {
      message.error("Xóa thất bại");
      console.error(error);
    }
  };

  const handleRestore = async (id) => {
    try {
      await userService.restore(id);
      message.success("Khôi phục thành công");
      initData();
    } catch (error) {
      message.error("Lỗi khôi phục");
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    const header = ["ID,Ho Ten,Email,Vi Tri,Phong Ban,Vai Tro"];
    const rows = filteredUsers.map(
      (u) =>
        `${u.id},${u.profile?.full_name || "N/A"},${u.email},${u.profile?.position || "N/A"},${u.profile?.department || "N/A"},${u.Role?.name}`,
    );
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" + header.concat(rows).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "danh_sach_nhan_su.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ĐỊNH NGHĨA CỘT BẢNG ---
  const mainColumns = [
    {
      title: "Nhân viên",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar src={record.profile?.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: "600" }}>
              {record.profile?.full_name || "N/A"}
            </div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              @{record.username}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vị trí/Phòng ban",
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.profile?.position || "N/A"}</Tag>
          <div style={{ fontSize: "11px", marginTop: "4px", color: "#595959" }}>
            {record.profile?.department}
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      render: (_, record) => (
        <Tag color="purple">{record.Role?.name?.toUpperCase() || "USER"}</Tag>
      ),
    },
    {
      title: "Hoạt động",
      render: (_, record) => (
        <Switch
          checked={!!record.is_active}
          disabled={record.Role?.name === "admin"}
          onChange={(checked) => handleToggleStatus(checked, record.id)}
        />
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingId(record.id);
                form.setFieldsValue({
                  ...record,
                  full_name: record.profile?.full_name,
                  position: record.profile?.position,
                  department: record.profile?.department,
                  phone: record.profile?.phone,
                  address: record.profile?.address,
                });
                setIsFormModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedUser(record);
                setIsDetailModalOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa nhân viên này?"
            onConfirm={() => handleSoftDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              disabled={record.Role?.name === "admin"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const recycleColumns = [
    { title: "Họ tên", dataIndex: ["UserProfile", "full_name"], key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày xóa",
      dataIndex: "deleted_at",
      render: (d) => new Date(d).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<ReloadOutlined />}
            onClick={() => handleRestore(record.id)}
          >
            Khôi phục
          </Button>
          <Popconfirm
            title="Xóa vĩnh viễn?"
            onConfirm={() => userService.forceDelete(record.id).then(initData)}
          >
            <Button danger icon={<RestOutlined />}>
              Xóa hẳn
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản trị nhân sự"
      extra={
        <Space>
          <Button icon={<FileExcelOutlined />} onClick={handleExportCSV}>
            Xuất Excel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setIsFormModalOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Input
          placeholder="Tìm tên hoặc email..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Lọc vai trò"
          style={{ width: 150 }}
          allowClear
          onChange={(v) => setFilterRole(v)}
        >
          {roles.map((r) => (
            <Select.Option key={r.id} value={r.id}>
              {r.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Tabs
        items={[
          {
            key: "1",
            label: "Danh sách nhân sự",
            children: (
              <Table
                columns={mainColumns}
                dataSource={filteredUsers}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8 }}
              />
            ),
          },
          {
            key: "2",
            label: `Thùng rác (${deletedUsers.length})`,
            children: (
              <Table
                columns={recycleColumns}
                dataSource={deletedUsers}
                rowKey="id"
                loading={loading}
              />
            ),
          },
        ]}
      />

      {/* MODAL THÊM/SỬA */}
      <Modal
        title={editingId ? "Cập nhật nhân sự" : "Thêm nhân sự mới"}
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Divider orientation="left">Tài khoản</Divider>
          <Space size="large" style={{ width: "100%" }}>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input disabled={!!editingId} />
            </Form.Item>
            <Form.Item
              name="password"
              label={editingId ? "Mật khẩu mới (Tùy chọn)" : "Mật khẩu"}
              rules={[{ required: !editingId }]}
              style={{ flex: 1 }}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="role_id"
              label="Vai trò"
              rules={[{ required: true }]}
            >
              <Select style={{ width: 140 }}>
                {roles.map((r) => (
                  <Select.Option key={r.id} value={r.id}>
                    {r.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>

          <Divider orientation="left">Thông tin cá nhân</Divider>
          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Space size="large" style={{ width: "100%" }}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="position"
              label="Vị trí công việc"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </Space>
          <Space size="large" style={{ width: "100%" }}>
            <Form.Item name="phone" label="Số điện thoại" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item name="department" label="Phòng ban" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL CHI TIẾT */}
      <Modal
        title="Chi tiết hồ sơ"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ tên">
              {selectedUser.profile?.full_name}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {selectedUser.profile?.position}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Điện thoại">
              {selectedUser.profile?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedUser.profile?.address}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default UserManagement;
