import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allNoti: [],
  notiLoading: false,
  error: false,
};

export const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notifcationStart: (state) => {
      state.notiLoading = true;
    },
    notifcationSuccess: (state, action) => {
      state.notiLoading = false;
      state.allNoti = action.payload;
    },
    notifcationError: (state) => {
      state.notiLoading = false;
      state.error = true;
    },
  },
});

export const { notifcationError, notifcationStart, notifcationSuccess } =
  NotificationSlice.actions;

// Thunk to fetch notifications
export const fetchNotifications = () => async (dispatch) => {
  dispatch(notifcationStart());
  try {
    const response = await axios.get("/api/notification"); // Replace with your API endpoint
    dispatch(notifcationSuccess(response.data));
    console.log("Fetched notifications:", response.data);
  } catch (err) {
    dispatch(notifcationError());
    console.error("Error fetching notifications:", err);
  }
};

export default NotificationSlice.reducer;