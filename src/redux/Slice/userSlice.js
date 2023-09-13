import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  config: {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  },
  currentUser: localStorage?.getItem("data")
    ? JSON.parse(localStorage?.getItem("data"))
    : null,
  loading: false,
  error: false,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginError: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      localStorage.removeItem("token");
      localStorage.removeItem("data");
    },
  },
});

export const { loginStart, loginSuccess, loginError, logout } =
  UserSlice.actions;

export default UserSlice.reducer;
