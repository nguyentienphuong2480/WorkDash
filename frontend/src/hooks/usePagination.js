import { useState } from "react";

export default function usePagination(init = { current: 1, pageSize: 10 }) {
  const [pagination, setPagination] = useState(init);

  // Hàm này sẽ được gọi khi bạn nhấn chuyển trang trên AntD Table
  const onChange = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  return { pagination, onChange, setPagination };
}