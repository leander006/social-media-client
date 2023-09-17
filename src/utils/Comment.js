import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  commentError,
  commentStart,
  commentSuccess,
} from "../redux/Slice/commentSlice";
import axios from "axios";
import { BASE_URL } from "../services/helper";

function Comment({ comment }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { allComment } = useSelector((state) => state.comment);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };

  const handledelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(commentStart());
      await axios.delete(
        `${BASE_URL}/api/comment/delete/${comment._id}`,
        config
      );
      dispatch(commentSuccess(allComment.filter((c) => c._id !== comment._id)));
    } catch (error) {
      dispatch(commentError());
      console.log(error?.response?.data);
    }
  };

  return (
    <>
      <div className="flex mt-1">
        <div className="flex p-1">
          <img
            src={
              comment?.user?.profile?.url
                ? comment?.user?.profile?.url
                : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
            }
            className="w-9 h-9 rounded-full cursor-pointer"
            alt={
              comment?.user?.profile?.url
                ? comment?.user?.profile?.url
                : comment?.user?.profile
            }
          />
          <Link to="/profile">
            <h1 className="capitalize font-bold mx-3 md:mr-3 cursor-pointer text-white">
              {comment?.user?.username}
            </h1>
          </Link>
        </div>
        <div className="relative ml-4 group basis-[70%] text-white">
          <p
            className={
              comment?.user?._id === currentUser._id
                ? "mt-1 cursor-pointer pr-2 ml-2 group-hover:block absolute"
                : "mt-1 pr-2 ml-2 group-hover:block absolute"
            }
          >
            {comment?.content}
          </p>
          {comment?.user?._id === currentUser._id && (
            <h1
              className="hidden cursor-pointer group-hover:block absolute bottom-[2.5rem] bg-gray-300 rounded p-1"
              onClick={handledelete}
            >
              Delete comment
            </h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Comment;
