import { useMemo } from "react";

/**
 * @param {Array} data - Mảng dữ liệu gốc
 * @param {Function} filterFn - Hàm logic để lọc dữ liệu
 */
export default function useTableFilter(data, filterFn) {
  // Chỉ tính toán lại danh sách khi dữ liệu gốc hoặc điều kiện lọc thay đổi
  return useMemo(() => {
    if (!data) return [];
    return filterFn(data);
  }, [data, filterFn]);
}