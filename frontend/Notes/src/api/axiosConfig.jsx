// src/api/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL, // <-- set in .env or Vercel
  withCredentials: true, // set true if using cookies/sessions
});

export default axiosInstance;
