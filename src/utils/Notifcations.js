import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteNotification,
} from "../redux/Slice/notificationSlice";

function Notifcations({ n, setNotify, notify }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleNotificationClick = async () => {
    try {
      // Dispatch the delete notification action
      dispatch(deleteNotification(n._id));
      setNotify(!notify); // Close the notification dropdown
      navigate("/chat");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div
      className="flex py-3 cursor-pointer ml-2 border border-x-0 border-t-0 border-b-1 items-center"
      onClick={handleNotificationClick}
    >
      <img
        src={n?.sender?.profile?.url}
        className="rounded-full h-8 w-8 "
        alt="searchFreind"
      />
      <div className="ml-2">
        <div className="name">{n?.content}</div>
      </div>
    </div>
  );
}

export default Notifcations;
