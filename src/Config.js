import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://social-media-appps.herokuapp.com/api/",
});
