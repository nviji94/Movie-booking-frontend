// api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL as string,
});

export default api;
