import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/loginService";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 AUTO REDIRECT nếu đã login
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/admin");
    }
  }, []);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await loginService.login(values);

      const { accessToken, refreshToken } = res.data?.data || {};

      if (!accessToken || !refreshToken) {
        throw new Error("Token không hợp lệ");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const meRes = await loginService.getMe();
      const user = meRes.data?.data;

      localStorage.setItem("user", JSON.stringify(user));

      message.success("Đăng nhập thành công");

      // 🔥 FIX QUAN TRỌNG
      navigate("/admin");

    } catch (err) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5"
    }}>
      <Card style={{ width: 400, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Đăng nhập hệ thống
        </Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;