import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { BASE_URL } from "../../services/helper";

// Create a socket instance outside of Redux state
let socket = null;

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isConnected: false, // Store only the connection status
  },
  reducers: {
    initializeSocket: (state) => {
      if (!socket) {
        socket = io(BASE_URL); // Initialize the socket connection
        state.isConnected = true; // Update connection status
      }
    },
    disconnectSocket: (state) => {
      if (socket) {
        socket.disconnect(); // Disconnect the socket
        socket = null;
        state.isConnected = false; // Update connection status
      }
    },
  },
});

export const { initializeSocket, disconnectSocket } = socketSlice.actions;

// Export a function to get the socket instance
export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call initializeSocket first.");
  }
  return socket;
};

export default socketSlice.reducer;