import axios from "axios";

const http = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Do NOT redirect on 401, just reject
http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default http;
