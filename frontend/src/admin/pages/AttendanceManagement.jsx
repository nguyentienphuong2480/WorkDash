import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  DatePicker,
  Space,
  message,
  Statistic,
} from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { attendanceService } from "../../services/attendanceService";
import { socket } from "../../services/socket";

const AttendanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState(null);
  const [list, setList] = useState([]);
  const [filterDate, setFilterDate] = useState(null);

  // ===== LOAD DATA =====
  const initData = async () => {
    setLoading(true);
    try {
      const [todayRes, listRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getList({
          date: filterDate?.format("YYYY-MM-DD"),
        }),
      ]);

      setToday(todayRes.data?.data || null);
      setList(listRes.data?.data || []);
    } catch (err) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, [filterDate]);

  // ===== REALTIME =====
  useEffect(() => {
    socket.on("attendance:update", initData);

    return () => {
      socket.off("attendance:update", initData);
    };
  }, []);

  // ===== ACTION =====
  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn();
      message.success("Check-in thành công");
      initData();
    } catch (err) {
      message.error(err.response?.data?.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();
      message.success("Check-out thành công");
      initData();
    } catch (err) {
      message.error(err.response?.data?.message);
    }
  };

  // ===== TABLE =====
  const columns = [
    {
      title: "Nhân viên",
      render: (_, r) => r.User?.username || "-",
    },
    {
      title: "Ngày",
      render: (_, r) => dayjs(r.date).format("DD/MM/YYYY"),
    },
    {
      title: "Check-in",
      render: (_, r) =>
        r.check_in ? dayjs(r.check_in).format("HH:mm") : "-",
    },
    {
      title: "Check-out",
      render: (_, r) =>
        r.check_out ? dayjs(r.check_out).format("HH:mm") : "-",
    },
    {
      title: "Giờ làm",
      render: (_, r) => r.working_hours || "-",
    },
    {
      title: "Trạng thái",
      render: (_, r) => {
        const color =
          r.status === "late"
            ? "orange"
            : r.status === "normal"
            ? "green"
            : "red";

        return <Tag color={color}>{r.status || "N/A"}</Tag>;
      },
    },
  ];

  return (
    <div>
      {/* ===== TODAY ===== */}
      <Card title="Chấm công hôm nay" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Check-in"
              value={
                today?.check_in
                  ? dayjs(today.check_in).format("HH:mm")
                  : "--"
              }
            />
          </Col>

          <Col span={6}>
            <Statistic
              title="Check-out"
              value={
                today?.check_out
                  ? dayjs(today.check_out).format("HH:mm")
                  : "--"
              }
            />
          </Col>

          <Col span={6}>
            <Statistic
              title="Working hours"
              value={today?.working_hours || 0}
              suffix="h"
            />
          </Col>

          <Col span={6}>
            <Space>
              <Button
                type="primary"
                icon={<LoginOutlined />}
                disabled={!!today?.check_in}
                onClick={handleCheckIn}
              >
                Check-in
              </Button>

              <Button
                danger
                icon={<LogoutOutlined />}
                disabled={!today?.check_in || !!today?.check_out}
                onClick={handleCheckOut}
              >
                Check-out
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ===== FILTER ===== */}
      <Card style={{ marginBottom: 20 }}>
        <DatePicker
          placeholder="Lọc theo ngày"
          onChange={(d) => setFilterDate(d)}
        />
      </Card>

      {/* ===== TABLE ===== */}
      <Card title="Lịch sử chấm công">
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          loading={loading}
          rowClassName={(r) => (r.status === "late" ? "row-late" : "")}
        />
      </Card>
    </div>
  );
};

export default AttendanceManagement;