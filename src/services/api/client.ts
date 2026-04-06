import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.autoplano.app/v1",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  config.headers.Accept = "application/json";
  return config;
});
