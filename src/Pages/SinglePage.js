
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../utils/Comment";
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
import { loginError, loginStart, loginSuccess } from "../redux/Slice/userSlice";
import toast from "react-hot-toast";
import InputEmoji from 'react-input-emoji'



function SinglePage() {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const { allComment } = useSelector((state) => state.comment);
  const { allpost } = useSelector((state) => state.post);
  const [isLiked, setIsLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState();


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
  useEffect(() => {
    setLike(post?.likes?.length);
    setIsLiked(currentUser.likedPost?.includes(postId));
    setBookmark(currentUser.bookmarkedPost?.includes(postId));
  }, [post?.likes, currentUser, postId]);

  const recalculate = (text) => {
    const currentLength = text.length;
    console.log(currentLength);
    console.log('enter in recalculate', text)
    setTextAreaCount(`${currentLength}/${max}`);
    setComment(text)
  };

  const handleLikes = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const { data } = await axios.post(
        `${BASE_URL}/api/like/${postId}`,
        { modelType: "Post" },
      );
      toast.success(`You ${!isLiked ? "liked" : "unliked"} the post`);
      dispatch(loginSuccess(data));
      localStorage.setItem("data", JSON.stringify(data));
      setLike(isLiked ? like - 1 : like + 1);
    } catch (error) {
      dispatch(loginError());
      console.log(error?.response?.data);
    }
  };

  const handleSaved = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const { data } = await axios.put(
        `${BASE_URL}/api/post/bookmarkPost/${postId}`,
        {},
      );
      console.log(data);
      dispatch(loginSuccess(data));
      localStorage.setItem("data", JSON.stringify(data));
      toast.success(
        `${!bookmark
          ? "Post saved successfully!"
          : "Post removed from saved posts"
        }`
      );
      setBookmark(!bookmark);
    } catch (error) {
      dispatch(loginError());
      console.log(error?.response?.data);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(postStart());
      const { data } = await axios.delete(
        `${BASE_URL}/api/post/delete/${postId}`,
      );
      dispatch(postSuccess(allpost));
      dispatch(loginSuccess(data));
      localStorage.setItem("data", JSON.stringify(data));
      toast.success("You deleted the post");
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

  const handleComment = async (text) => {
    try {
      setComment(text);
      dispatch(commentStart());
      console.log("comment " + comment);

      const { data } = await axios.post(
        `${BASE_URL}/api/comment/${postId}`,
        { content: comment, modelType: "Post" },
      );
      toast.success("Comment added successfully");
      dispatch(commentSuccess([data, ...allComment]));
      setComment("");
    } catch (error) {
      dispatch(commentError());
      console.log(error?.response?.data);
    }
  };

  return (
    <>
      <div className="flex flex-col z-50 lg:absolute md:top-2 left-0 w-full md:pl-4 h-[calc(100vh-16px)] lg:h-[calc(100vh-132px)]">
        <i onClick={() => navigate(-1)} className="lg:flex hidden justify-end right-0 fa-solid fa-2xl py-5 fa-x text-white mr-10 cursor-pointer"></i>

        {loading ? (
          // <div className="flex flex-col lg:i tems-center lg:justify-center lg:flex-row w-full bg-white">
          <div className="flex flex-col lg:flex-row w-full lg:h-[calc(100vh-176px)] h-[calc(100vh-86px)] ">
            <i onClick={() => navigate(-1)} className="flex lg:hidden fa-solid fa-arrow-left text-white ml-2 mb-2 cursor-pointer"></i>
            <div className="hidden lg:flex lg:border border-[#BED7F8] border-x-0 border-y-0 w-[50%]">
              <img
                className="lg:w-full h-full w-screen lg:object-cover object-contain"
                src={post?.content?.url}
                alt="singlePost"
              />
            </div>
            <div className="flex flex-col justify-between border border-[#BED7F8] pt-1 px-2 h-full lg:w-[50%] md:bg-[#2f3549]">
              <div className="flex p-1 flex-col justify-between h-[30%] md:h-[40%] border-x-0 border-b-2 border-[#BED7F8]">
                <div className="flex">
                  <div className="flex p-1 basis-10 rounded-full">
                    <img
                      src={
                        post?.owner?.profile?.url
                          ? post?.owner?.profile?.url
                          : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
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
                <div className="flex pl-3">
                  <div className="flex items-end">
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
                </div>
              </div>
              <div className="flex flex-col justify-between h-[70%] lg:h-[60%] ">
                {allComment.length === 0 ? (
                  <div className="border-x-0 flex items-center justify-center h-[80%] ">
                    <h1 className="text-slate-400">No Comments</h1>
                  </div>
                ) : (
                  <div className=" mt-2 h-[80%] border-b-0 overflow-y-scroll overflow-x-hidden">
                    {allComment?.map((c) => (
                      <Comment key={c._id} comment={c} />
                    ))}
                  </div>
                )}

                <div className="flex items-center bg-[#455175] mb-1 lg:mb-2 rounded-md w-full">
                  <div className="flex items-center w-[80%]">
                    <InputEmoji
                      value={comment}
                      onChange={recalculate}
                      cleanOnEnter
                      pickerStyle={{
                        zIndex: 50, // Ensure it appears above other elements
                        width: '90%', // Adjust width for mobile
                        maxWidth: '7000px', // Optional limit for larger screens
                        bottom: '5px', // Adjust position
                      }}
                      onEnter={handleComment}
                      maxLength={max}
                      placeholder="Type a message" />
                  </div>
                  <p className="w-[20%] md:text-center">{textAreaCount}</p>
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
