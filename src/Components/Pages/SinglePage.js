import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../Comment";
import Navbar from "../Navbar";
import Cookie from "js-cookie";
import SingleSkeleton from "../Skeleton/SingleSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  loginError,
  loginStart,
  loginSuccess,
} from "../../redux/Slice/userSlice";
import {
  commentError,
  commentStart,
  commentSuccess,
} from "../../redux/Slice/commentSlice";
import { postError, postStart, postSuccess } from "../../redux/Slice/postSlice";
import axios from "axios";

function SinglePage() {
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${Cookie.get("token")}`,
    },
  };
  const user = currentUser?.others ? currentUser?.others : currentUser;

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/post/" + postId,
          config
        );
        setPost(data);
        setLoading(true);
        // setLike(data?.likes?.length);
        // setIsLiked(user.likedPost?.includes(postId));
        // setBookmark(user.bookmarkedPost?.includes(postId));
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    getPost();
    // eslint-disable-next-line
  }, [user, comment]);

  // useEffect(() => {
  //   setLike(post?.likes?.length);
  //   setIsLiked(user.likedPost?.includes(postId));
  //   setBookmark(user.bookmarkedPost?.includes(postId));
  // }, [user, postId, like]);

  // const handleLikes = async (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(loginStart());
  //     const { data } = await axios.post(
  //       `http://localhost:3001/api/like/${postId}`,
  //       { modelType: "Post" },
  //       config
  //     );
  //     dispatch(loginSuccess(data));
  //     setLike(isLiked ? like - 1 : like + 1);
  //   } catch (error) {
  //     dispatch(loginError());
  //     console.log(error?.response?.data);
  //   }
  // };

  // const handleSaved = async (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(loginStart());
  //     const { data } = await axios.put(
  //       `http://localhost:3001/api/post/bookmarkPost/${postId}`,
  //       {},
  //       config
  //     );
  //     console.log("data", data);
  //     dispatch(loginSuccess(data));
  //   } catch (error) {
  //     dispatch(loginError());
  //     console.log(error);
  //   }
  // };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(postStart());
      await axios.delete(
        `http://localhost:3001/api/post/delete/${postId}`,
        config
      );
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
          "http://localhost:3001/api/comment/allComment/" + postId,
          config
        );
        dispatch(commentSuccess(data));
        console.log();
      } catch (error) {
        dispatch(commentError());
        console.log(error?.response?.data);
      }
    };
    getCommet();
    // eslint-disable-next-line
  }, [postId, comment]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      dispatch(commentStart());
      const { data } = await axios.post(
        `http://localhost:3001/api/comment/${postId}`,
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
      <Navbar />
      <div className="flex w-screen bg-[#2D3B58] pt-9 h-screen">
        {loading ? (
          <div className="flex flex-col py-4 lg:items-center lg:justify-center lg:p-4 lg:flex-row w-full ">
            <div className="hidden lg:flex lg:h-5/6 lg:border border-[#BED7F8] border-x-0 border-y-0 ">
              <img
                className="lg:w-fit h-full w-screen lg:object-cover object-contain"
                src={post?.content}
                alt="singlePost"
              />
            </div>
            <div className="flex flex-col justify-between lg:border border-[#BED7F8] pt-1 px-2 lg:h-5/6 lg:w-2/5  overflow-y-scroll  ">
              <div className="flex p-1 flex-col justify-between ">
                <div className="flex items-center">
                  <div className="flex p-1 basis-10 rounded-full">
                    <img
                      src={post?.owner?.profile}
                      alt="singlePost"
                      className="rounded-full h-fit cursor-pointer"
                      onClick={click}
                    />
                  </div>
                  <div className="flex lg:flex-col basis-10/12">
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
                      <i className="fa-solid text-black fa-xl fa-trash-can cursor-pointer"></i>
                    </div>
                  )}
                </div>
                {/* <div className="flex pl-3 mt-2">
                  <div className="flex items-center ">
                    <div
                      className="flex likes cursor-pointer flex-col justify-center mt-3"
                      onClick={handleLikes}
                    >
                      {isLiked ? (
                        <i className="fa-solid fa-heart fa-2xl pr-3 text-red-700" />
                      ) : (
                        <i className="fa-regular fa-heart fa-2xl pr-3" />
                      )}
                      <h1 className="mt-3 ml-3">{like}</h1>
                    </div>
                  </div>
                  <div className="mb-6 cursor-pointer">
                    {bookmark ? (
                      <i
                        className="fa-solid fa-xl fa-bookmark cursor-pointer"
                        onClick={handleSaved}
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-xl fa-bookmark cursor-pointer"
                        onClick={handleSaved}
                      ></i>
                    )}
                  </div>
                </div> */}
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
                  <input
                    className="w-full rounded-md p-1"
                    value={comment}
                    placeholder="Comment here"
                    onChange={(e) => setComment(e.target.value)}
                    type="text"
                  ></input>
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
