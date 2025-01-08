import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_BASE_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("auth_t") || ""; // Get token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set token directly on the config headers
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (typeof config.data === "object") {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log("error !!! ", error)
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        
      });
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
