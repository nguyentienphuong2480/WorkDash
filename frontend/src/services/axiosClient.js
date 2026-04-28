import axios from "axios";

const baseURL ="https://workdash-1.onrender.com/api";

const axiosClient = axios.create({ baseURL,withCredentials: true });

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

/* ================= REQUEST ================= */
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE ================= */
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response) return Promise.reject(error);

    // ❌ Không phải 401 → bỏ qua
    if (error.response.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // ===== Queue request khi đang refresh =====
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      // ⚠️ Dùng axiosClient để giữ baseURL
      const res = await axiosClient.post("/auth/refresh-token", {
        refreshToken,
      });

      const newAccessToken = res.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("No access token returned");
      }

      localStorage.setItem("accessToken", newAccessToken);

      processQueue(null, newAccessToken);

      original.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosClient(original);
    } catch (err) {
      processQueue(err);
      logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;