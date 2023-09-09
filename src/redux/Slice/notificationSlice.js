import { createSlice } from "@reduxjs/toolkit";

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

export default NotificationSlice.reducer;
