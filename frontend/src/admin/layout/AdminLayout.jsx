import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Breadcrumb,
  Avatar,
  Dropdown,
  Space,
  theme,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import { menuConfig } from "../config/menuConfig";
import NotificationBell from "../../components/NotificationBell";


const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // ===== USER =====
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ===== MENU =====
  const menuItems = menuConfig
    .filter((item) => item.roles.includes(user.role))
    .map((item) => ({
      key: item.key,
      icon: React.createElement(item.icon),
      label: <Link to={item.key}>{item.label}</Link>,
    }));

  // ===== ACTIVE =====
  const selectedKey = location.pathname;

  // ===== BREADCRUMB =====
  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = "/" + pathSnippets.slice(0, index + 1).join("/");
    const found = menuConfig.find((m) => m.key === url);

    return {
      title: found ? found.label : url,
    };
  });

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const dropdownItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ===== SIDEBAR ===== */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: "#001529",
        }}
      >
        {/* LOGO */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          style={{
            height: 56,
            margin: 12,
            borderRadius: 10,
            background: "linear-gradient(135deg, #1677ff, #69b1ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: "0 12px",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ⚡ {!collapsed && <span style={{ marginLeft: 10 }}>HRM Pro</span>}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>

      {/* ===== MAIN ===== */}
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {/* LEFT */}
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />

            <span style={{ fontWeight: 600 }}>Dashboard</span>
          </Space>

          {/* RIGHT */}
          <Dropdown menu={{ items: dropdownItems }}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              {!collapsed && (
                <>
                  <span>{user?.role || "User"}</span>
                  <DownOutlined />
                </>
              )}
            </Space>
          </Dropdown>
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            margin: "16px",
            padding: 16,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* BREADCRUMB */}
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={breadcrumbItems}
          />

          {/* PAGE */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;