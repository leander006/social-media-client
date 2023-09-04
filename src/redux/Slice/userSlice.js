import { createSlice } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

const initialState = {
  currentUser: Cookie?.get("data") ? JSON?.parse(Cookie?.get("data")) : null,
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
      Cookie.remove("token");
      Cookie.remove("data");
    },
  },
});

export const { loginStart, loginSuccess, loginError, logout } =
  UserSlice.actions;

export default UserSlice.reducer;
