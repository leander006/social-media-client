import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { loginError, loginStart, loginSuccess } from "../redux/Slice/userSlice";
import axios from "axios";

function ExploreMore({ explore }) {
  const { currentUser } = useSelector((state) => state.user);
  const [like, setLike] = useState(explore?.likes?.length);
  const [isLiked, setIsLiked] = useState(
    explore.likes?.includes(currentUser._id)
  );
  const [bookmark, setBookmark] = useState(
    explore.bookmark?.includes(currentUser._id)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookie.get("token")}`,
    },
  };

  const click = () => {
    navigate("/profile/" + explore?.owner?._id);
  };

  const handleLikes = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const { data } = await axios.put(
        `/post/likePost/${explore._id}`,
        {},
        config
      );
      dispatch(loginSuccess(data));
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
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
        `/post/bookmarkPost/${explore?._id}`,
        {},
        config
      );
      dispatch(loginSuccess(data));
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
  }, [explore._id, currentUser]);

  return (
    <>
      <div className="flex flex-col w-full bg-[#38487a] hover:scale-105 duration-150 p-1.5 border my-6 rounded-lg">
        <div className="flex p-1 items-center">
          <img
            src={explore?.owner?.profile}
            alt="ExploreMore"
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
        <div className="flex justify-center">
          <Link to={"/singlePage/" + explore?._id}>
            <img
              src={explore?.content}
              className="w-screen rounded-lg  object-contain cursor-pointer "
              alt="ExploreMore"
            />
          </Link>
        </div>
        <div className="flex my-3 mx-3 items-center justify-between">
          <div
            className="flex likes cursor-pointer items-center"
            onClick={handleLikes}
          >
            <div className="flex flex-col justify-center mt-3">
              {isLiked ? (
                <i className="fa-solid fa-heart fa-2xl pr-3 text-red-700" />
              ) : (
                <i className="fa-regular fa-heart fa-2xl pr-3" />
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
