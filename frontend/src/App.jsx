import { RouterProvider } from "react-router-dom";
import { router } from "./admin/routes";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN"; // Việt hóa các thành phần của Ant Design

function App() {
  return (
    // ConfigProvider giúp bạn chỉnh sửa theme (màu sắc) và ngôn ngữ cho AntD
    <ConfigProvider locale={viVN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;