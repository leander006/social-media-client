
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  commentError,
  commentStart,
  commentSuccess,
} from "../redux/Slice/commentSlice";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import toast from "react-hot-toast";

function Comment({ comment }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { allComment } = useSelector((state) => state.comment);


  const handledelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(commentStart());
      await axios.delete(
        `${BASE_URL}/api/comment/delete/${comment._id}`,
      );
      dispatch(commentSuccess(allComment.filter((c) => c._id !== comment._id)));
      toast.success("Deleted the comment");
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
          <Link to={"/profile/" + comment?.user?._id}>
            <h1 className="capitalize font-bold mx-3 md:mr-3 cursor-pointer text-white">
              {comment?.user?.username}
            </h1>
          </Link>
        </div>
        <div className="flex items-center ml-4 basis-[90%] text-white pb-3">
          <p
            className={
              comment?.user?._id === currentUser._id
                ? "mt-1 pr-2 mx-2 w-36 md:w-fit lg:w-44 xl:w-60 2xl:w-fit break-words"
                : "mt-1 pr-2 ml-2  w-36 md:w-fit lg:w-44 xl:w-60 2xl:w-fit break-words"
            }
          >
            {comment?.content}
          </p>
          <div className="relative group">
            <i className="fa-solid fa-ellipsis-vertical cursor-pointer ml-3"></i>
            <div className="hidden absolute right-0 text-[#2f3549] group-hover:block bg-white p-0.5 cursor-pointer" onClick={handledelete}>Delete</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
