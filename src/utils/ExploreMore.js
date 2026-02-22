
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginError, loginStart, loginSuccess } from "../redux/Slice/userSlice";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import toast from "react-hot-toast";

function ExploreMore({ explore }) {
  const { currentUser } = useSelector((state) => state.user);
  const [like, setLike] = useState(explore?.likes?.length);
  const user = currentUser?.others ? currentUser?.others : currentUser;
  const [isLiked, setIsLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [post, setPost] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/post/` + explore?._id,
          config
        );
        setPost(data);
        setLike(data?.likes?.length);
        setIsLiked(user?.likedPost?.includes(explore?._id));
        setBookmark(user?.bookmarkedPost?.includes(explore?._id));
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    getPost();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    setLike(post?.likes?.length);
    setIsLiked(user?.likedPost?.includes(explore?._id));
    setBookmark(user?.bookmarkedPost?.includes(explore?._id));
    // eslint-disable-next-line
  }, [user, explore?._id, like]);

  const click = () => {
    navigate("/profile/" + explore?.owner?._id);
  };

  const handleLikes = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const { data } = await axios.post(
        `${BASE_URL}/api/like/${explore?._id}`,
        { modelType: "Post" },
        config
      );
      console.log(data);
      dispatch(loginSuccess(data));
      localStorage.setItem("data", JSON.stringify(data));
      toast.success(`You ${!isLiked ? "liked" : "unliked"} the post`);
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
        `${BASE_URL}/api/post/bookmarkPost/${explore?._id}`,
        {},
        config
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

  useEffect(() => {
    setIsLiked(
      currentUser?.others
        ? currentUser.others?.likedPost?.includes(explore._id)
        : currentUser.likedPost?.includes(explore._id)
    );
    setBookmark(
      currentUser?.others
        ? currentUser?.others?.bookmarkedPost?.includes(explore._id)
        : currentUser.bookmarkedPost?.includes(explore._id)
    );
  }, [explore._id, currentUser, like]);

  return (
    <>
      <div className="flex flex-col bg-[#38487a] px-1.5 border my-3 rounded-lg h-[475px]">
        <div className="flex p-1 items-center">
          <img
            src={
              explore?.owner?.profile?.url
                ? explore?.owner?.profile?.url
                : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
            }
            alt={
              explore?.owner?.profile?.url
                ? explore?.owner?.profile?.url
                : explore?.owner?.profile
            }
            className="w-12 h-12 rounded-full cursor-pointer border"
            onClick={click}
          />
          <h1
            className="capitalize ml-2 font-sans cursor-pointer text-white"
            onClick={click}
          >
            {explore?.owner?.username}
          </h1>
        </div>
        <div className="flex justify-center h-full overflow-hidden">
          <Link to={"/singlePage/" + explore?._id} className="w-full h-full">
            <img
              src={explore?.content?.url || "https://via.placeholder.com/300"}
              className="rounded-lg cursor-pointer w-full h-full object-fit"
              alt="ExploreMore"
            />
          </Link>
        </div>
        <div className="flex my-3 mx-3 items-center justify-between">
          <div className="flex items-center">
            <div
              className="flex flex-col justify-center mt-3"
              onClick={handleLikes}
            >
              {isLiked ? (
                <i className="fa-solid fa-heart cursor-pointer fa-2xl pr-3 text-red-700" />
              ) : (
                <i className="fa-regular fa-heart cursor-pointer fa-2xl pr-3" />
              )}
              <h1 className="mt-3 ml-1">{like}</h1>
            </div>
            <Link to={"/singlePage/" + explore?._id}>
              <div>
                <i className="fa-regular fa-2xl fa-comment cursor-pointer"></i>
                <h1>{explore?.comments?.length}</h1>
              </div>
            </Link>
          </div>
          <div>
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
    </>
  );
}

export default ExploreMore;
