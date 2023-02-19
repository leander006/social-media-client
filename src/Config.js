import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://leander-socail-media.onrender.com/api/",
});
