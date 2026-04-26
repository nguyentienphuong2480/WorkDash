import { useContext } from "react";
// Lưu ý đường dẫn import đã thay đổi để khớp với cấu trúc mới của bạn
import { AuthContext } from "@/contexts/AuthContext"; 

export default function useAuth() {
  const ctx = useContext(AuthContext);
  
  if (!ctx) {
    // Thông báo lỗi này giúp bạn debug nhanh nếu quên bọc AuthProvider ở main.jsx hoặc App.jsx
    throw new Error("useAuth must be used inside AuthProvider");
  }
  
  return ctx;
}