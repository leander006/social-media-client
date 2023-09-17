import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  chatError,
  chatStart,
  chatSuccess,
  setCurrentChat,
} from "../redux/Slice/chatSlice";
import axios from "axios";
import { BASE_URL } from "../services/helper";

function DirectMessage({ search, setSearched, setSearch }) {
  const { allChat } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };

  const openChat = async (e) => {
    e.preventDefault();
    try {
      dispatch(chatStart());
      const { data } = await axios.post(
        `${BASE_URL}/api/chat/` + search._id,
        {},
        config
      );
      if (typeof data.res === "string") {
        dispatch(setCurrentChat(data.chat));
        setSearched([]);
        setSearch("");
        return;
      }
      dispatch(chatSuccess([data, ...allChat]));
      dispatch(setCurrentChat(data));
      console.log("search");
      setSearched([]);
    } catch (error) {
      dispatch(chatError());
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="flex bg-slate-300 p-2 cursor-pointer items-center"
        onClick={openChat}
      >
        <img
          src={
            search?.profile?.url
              ? search?.profile?.url
              : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
          }
          className="rounded-full h-10 w-10"
          alt="directMessage"
        />
        <div className="flex-1 ml-2">
          <div>{search.username}</div>
        </div>
      </div>
    </>
  );
}

export default DirectMessage;
