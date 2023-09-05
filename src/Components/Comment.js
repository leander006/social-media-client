import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  commentError,
  commentStart,
  commentSuccess,
} from "../redux/Slice/commentSlice";
import Cookie from "js-cookie";
import axios from "axios";

function Comment({ comment }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { allComment } = useSelector((state) => state.comment);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookie.get("token")}`,
    },
  };

  const handledelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(commentStart());
      await axios.delete(
        `http://localhost:3001/api/comment/delete/${comment._id}`,
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
            src={comment?.user?.profile}
            className="w-9 h-9 rounded-full cursor-pointer"
            alt="comments"
          />
          <Link to="/profile">
            <h1 className="capitalize ml-3 md:mr-3 cursor-pointer text-white">
              {comment?.user?.username}
            </h1>
          </Link>
        </div>
        <div className="relative group basis-9/12 text-white">
          <p
            className={
              comment?.user?._id === currentUser._id
                ? "mt-1 cursor-pointer pr-2 ml-2 group-hover:block absolute"
                : "mt-1 pr-2 group-hover:block absolute"
            }
          >
            {comment?.content}
          </p>
          <h1
            className="hidden cursor-pointer group-hover:block absolute bottom-[3.3rem] bg-gray-300 rounded p-1"
            onClick={handledelete}
          >
            Delete comment
          </h1>
        </div>
      </div>
    </>
  );
}

export default Comment;
