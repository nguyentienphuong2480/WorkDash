/**
 * Format trả về thống nhất cho API
 * - Success có payload: { data, message? }
 * - Success có pagination: { data, pagination }
 * - Success chỉ thông báo: { message }
 */

const success = (res, data, options = {}) => {
  const { status = 200, message } = options;
  const body = message != null ? { data, message } : { data };
  return res.status(status).json(body);
};

const successMessage = (res, message, status = 200) => {
  return res.status(status).json({ message });
};

const successList = (res, data, pagination) => {
  if (pagination != null) {
    return res.json({ data, pagination });
  }
  return res.json({ data });
};

module.exports = { success, successMessage, successList };
