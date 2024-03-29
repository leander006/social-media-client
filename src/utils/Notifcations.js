import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  notifcationError,
  notifcationStart,
  notifcationSuccess,
} from "../redux/Slice/notificationSlice";
import { BASE_URL } from "../services/helper";

function Notifcations({ n, setNotify, notify }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allNoti } = useSelector((state) => state.notification);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };

  return (
    <div
      className="flex py-3 cursor-pointer ml-2 border border-x-0 border-t-0 border-b-1 items-center"
      onClick={async () => {
        setNotify(!notify);
        try {
          dispatch(notifcationStart());
          const { data } = await axios.delete(
            `${BASE_URL}/api/notification/${n._id}`,
            config
          );
          console.log(data);
          dispatch(
            notifcationSuccess(allNoti.filter((n) => n._id !== data._id))
          );
          navigate("/chat");
        } catch (error) {
          dispatch(notifcationError());
          console.log(error);
        }
      }}
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
