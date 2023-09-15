import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../utils/Comment";
import Navbar from "../utils/Navbar";
import SingleSkeleton from "../Skeleton/SingleSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  commentError,
  commentStart,
  commentSuccess,
} from "../redux/Slice/commentSlice";
import { postError, postStart, postSuccess } from "../redux/Slice/postSlice";
import axios from "axios";
import { BASE_URL } from "../services/helper";

function SinglePage({ socket }) {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const { allComment } = useSelector((state) => state.comment);
  const { allpost } = useSelector((state) => state.post);
  // const [isLiked, setIsLiked] = useState(false);
  // const [bookmark, setBookmark] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  // const [like, setLike] = useState();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [textAreaCount, setTextAreaCount] = useState("0/45");
  const max = 45;

  const user = currentUser?.others ? currentUser?.others : currentUser;

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/post/` + postId,
          config
        );
        setPost(data);
        setLoading(true);
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    getPost();
    // eslint-disable-next-line
  }, [user]);
  const recalculate = (e) => {
    const currentLength = e.target.value.length;
    setTextAreaCount(`${currentLength}/${max}`);
    setComment(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(postStart());
      await axios.delete(`${BASE_URL}/api/post/delete/${postId}`, config);
      dispatch(postSuccess(allpost));
      navigate("/home");
    } catch (error) {
      dispatch(postError());
      console.log(error?.response?.data);
    }
  };

  const click = () => {
    navigate("/profile/" + post?.owner?._id);
  };

  useEffect(() => {
    const getCommet = async () => {
      try {
        dispatch(commentStart());
        const { data } = await axios.get(
          `${BASE_URL}/api/comment/allComment/` + postId,
          config
        );
        dispatch(commentSuccess(data));
      } catch (error) {
        dispatch(commentError());
        console.log(error?.response?.data);
      }
    };
    getCommet();
    // eslint-disable-next-line
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      dispatch(commentStart());
      const { data } = await axios.post(
        `${BASE_URL}/api/comment/${postId}`,
        { content: comment, modelType: "Post" },
        config
      );
      dispatch(commentSuccess([data, ...allComment]));
      setComment("");
    } catch (error) {
      dispatch(commentError());
      console.log(error?.response?.data);
    }
  };

  return (
    <>
      <Navbar socket={socket} />
      <div className="flex w-screen pt-9 h-screen">
        {loading ? (
          <div className="flex flex-col py-4 lg:items-center lg:px-6 lg:justify-center lg:p-4 lg:flex-row w-full ">
            <div className="hidden lg:flex lg:h-5/6 lg:border border-[#BED7F8] border-x-0 border-y-0 ">
              <img
                className="lg:w-fit h-full w-screen lg:object-cover object-contain"
                src={post?.content?.url}
                alt="singlePost"
              />
            </div>
            <div className="flex flex-col justify-between lg:border border-[#BED7F8] pt-1 px-2 lg:h-5/6 xl:w-2/5 lg:w-3/5  overflow-y-scroll  ">
              <div className="flex p-1 flex-col justify-between ">
                <div className="flex">
                  <div className="flex p-1 basis-10 rounded-full">
                    <img
                      src={
                        post?.owner?.profile?.url
                          ? post?.owner?.profile?.url
                          : post?.owner?.profile
                      }
                      alt={
                        post?.owner?.profile?.url
                          ? post?.owner?.profile?.url
                          : post?.owner?.profile
                      }
                      className="rounded-full h-8 w-8 cursor-pointer"
                      onClick={click}
                    />
                  </div>
                  <div className="flex flex-col basis-10/12">
                    <h1
                      className="capitalize ml-2 font-sans cursor-pointer font-bold text-white"
                      onClick={click}
                    >
                      {post?.owner?.username}
                    </h1>
                    <p className="ml-2 text-slate-300 ">{post?.caption}</p>
                  </div>
                  {post?.owner?._id === user?._id && (
                    <div onClick={handleDelete}>
                      <i className="fa-solid items-start text-black fa-xl fa-trash-can cursor-pointer"></i>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between lg:h-fit h-screen lg:basis-2/3">
                {allComment.length === 0 ? (
                  <div className="border-x-0 flex items-center justify-center border-t-2 border-[#BED7F8]  h-3/5 lg:h-5/6  border-b-0 ">
                    <h1 className="text-slate-400">No Comments</h1>
                  </div>
                ) : (
                  <div className="border-x-0 border-t-2 border-[#BED7F8] mt-2 h-3/5 lg:h-5/6 border-b-0">
                    {allComment?.map((c) => (
                      <Comment key={c._id} comment={c} />
                    ))}
                  </div>
                )}

                <div className="flex items-center bg-[#455175] mb-1 lg:mb-2 rounded-md">
                  <div className="flex w-full items-center">
                    <input
                      className="w-full rounded-md p-1"
                      value={comment}
                      maxLength={max}
                      placeholder="Comment here"
                      onChange={recalculate}
                      type="text"
                    ></input>
                    <p className="text-end mx-2">{textAreaCount}</p>
                  </div>

                  <i
                    className="fa-solid fa-xl fa-paper-plane p-2 text-[#BED7F8] cursor-pointer "
                    onClick={handleComment}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SingleSkeleton />
        )}
      </div>
    </>
  );
}

export default SinglePage;
