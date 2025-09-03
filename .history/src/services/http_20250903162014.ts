import axios from "axios";
import { getBackendUrl } from "../config";

const http = axios.create({
  baseURL: getBackendUrl(),
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
