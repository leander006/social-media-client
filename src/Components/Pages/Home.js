import React, { useEffect, useState } from "react";
import ExploreMore from "../utils/ExploreMore";
import Navbar from "../utils/Navbar";
import SearchFreindSkeleton from "../Skeleton/SearchFreindSkeleton";
import PostSkeleton from "../Skeleton/PostSkeleton";

import { useDispatch, useSelector } from "react-redux";
import {
  followerPostError,
  followerPostStart,
  followerPostSuccess,
} from "../../redux/Slice/postSlice";

import SearchFreind from "../utils/SearchFreind";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function Home({ socket }) {
  const { followerPost, loading } = useSelector((state) => state.post);
  const { currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState([]);
  const [sloading, setSloading] = useState(false);
  const dispatch = useDispatch();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  };
  useEffect(() => {
    socket.emit("login", { userId: currentUser?._id });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        setSloading(true);
        const { data } = await axios.get(
          "http://localhost:3001/api/user/suggesteduser/user",
          config
        );
        setSearch(data);
        setSloading(false);
      } catch (error) {
        toast.error("error?.response?.data");
        console.log(error);
      }
    };
    getUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getFollowersPost = async () => {
      try {
        dispatch(followerPostStart());
        const { data } = await axios.get(
          "http://localhost:3001/api/post/following/Post",
          config
        );
        dispatch(followerPostSuccess(data));
        // console.log("data", data);
      } catch (error) {
        dispatch(followerPostError());
        toast.error("error?.response?.data");
        // alert("error?.response?.data")
        console.log("error ", error?.response?.data);
      }
    };
    getFollowersPost();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar socket={socket} />
      <div className="flex bg-[#2D3B58] z-50 mt-10 ">
        {!loading ? (
          <div className="main md:flex mx-auto lg:basis-[70%] md:basis-[60%] ">
            {followerPost?.length !== 0 ? (
              <div className="flex flex-col lg:pl-[17rem] md:pr-5 md:pt-2 md:pb-10 h-[calc(100vh-2.7rem)] overflow-y-scroll  ">
                {followerPost?.map((p) => (
                  <ExploreMore explore={p} key={p._id} />
                ))}
              </div>
            ) : (
              <div className=" lg:basis-[70%] justify-center flex items-center lg:items-start lg:pt-36 m-auto font-bold md:text-3xl h-[calc(100vh-2.7rem)] text-[#547bca]">
                No Post!Please Follow Someone
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-2.3rem)]  lg:border-[#BED7F8]">
            <PostSkeleton />
          </div>
        )}

        <div className="hidden lg:flex basis-[30%] lg:mr-[10rem] lg:ml-[2rem] md:w-60 h-[calc(100vh-3.5rem)] overflow-y-scroll lg:w-80 xl:w-96 ml-2 flex-col  mt-3 text-white ">
          <h1>Suggested Followers</h1>
          {!sloading ? (
            <div>
              {search.map((s) => (
                <SearchFreind search={s} key={s._id} setSearch={setSearch} />
              ))}
            </div>
          ) : (
            <SearchFreindSkeleton />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
