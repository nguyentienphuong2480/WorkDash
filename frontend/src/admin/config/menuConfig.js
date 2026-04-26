import {
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  SettingOutlined,
  DollarOutlined,
} from "@ant-design/icons";

export const menuConfig = [
  {
    key: "/admin/dashboard",
    icon: DashboardOutlined,
    label: "Trang chủ",
    roles: ["admin", "manager",  "employee"],
  },
  {
    key: "/admin/users",
    icon: UserOutlined,
    label: "Người dùng",
    roles: ["admin"],
  },
  {
    key: "/admin/projects",
    icon: ProjectOutlined,
    label: "Dự án",
    roles: ["admin", "manager",  "employee"],
  },
  {
    key: "/admin/tasks",
    icon: CheckSquareOutlined,
    label: "Task",
    roles: ["admin", "manager", "employee"],
  },
  {
    key: "/admin/attendance",
    icon: CalendarOutlined,
    label: "Chấm công",
    roles: ["admin", "manager", "employee"],
  },
  {
    key: "/admin/salary",
    icon: DollarOutlined,
    label: "Lương",
    roles: ["admin"],
  },
  {
    key: "/admin/settings",
    icon: SettingOutlined,
    label: "Cài đặt",
    roles: ["admin"],
  },
];