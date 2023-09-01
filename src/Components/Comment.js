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
  const [visible, setVisible] = useState(false);
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
      <div className="flex ">
        <div className="flex basis-1/2 p-1 mt-1 mr-2">
          <img
            src={comment?.username?.profile}
            className="w-9 h-9 rounded-full cursor-pointer border"
            alt="comments"
          />
          <Link to="/profile">
            <h1 className="capitalize ml-1 md:mr-12 cursor-pointer text-white">
              {comment?.username?.username}
            </h1>
          </Link>
        </div>
        <div className="mt-1 basis-9/12 text-white mb-4">
          {visible && comment?.username?._id === currentUser._id && (
            <h1
              className="cursor-pointer mt-7 fixed z-40 bg-gray-300 rounded p-1"
              onClick={handledelete}
            >
              Delete comment
            </h1>
          )}
          <p
            className={
              comment?.username?._id === currentUser._id
                ? "mt-1 cursor-pointer pr-2 lg:w-52"
                : "mt-1 pr-2 lg:w-52"
            }
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {comment?.content}
          </p>
        </div>
      </div>
    </>
  );
}

export default Comment;
