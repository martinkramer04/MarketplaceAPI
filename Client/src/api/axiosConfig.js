import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4002",
  headers: { "Content-Type": "application/json" },
});

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(payload.exp);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
