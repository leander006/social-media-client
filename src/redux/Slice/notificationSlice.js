import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../services/helper";

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
    deleteNotificationSuccess: (state, action) => {
      state.allNoti = state.allNoti.filter((n) => n._id !== action.payload); // Remove the deleted notification
    },
  },
});

export const { notifcationError, notifcationStart, notifcationSuccess, deleteNotificationSuccess } =
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
export const deleteNotification = (notificationId) => async (dispatch) => {
  dispatch(notifcationStart());
  try {
    await axios.delete(
      `${BASE_URL}/api/notification/${notificationId}`

    );
    dispatch(deleteNotificationSuccess(notificationId)); // Dispatch the success action with the notification ID
  } catch (error) {
    dispatch(notifcationError());
    console.error("Error deleting notification:", error);
  }
};


export default NotificationSlice.reducer;