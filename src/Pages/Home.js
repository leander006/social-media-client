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
} from "../redux/Slice/postSlice";

import SearchFreind from "../utils/SearchFreind";
import axios from "axios";
import { toast } from "react-hot-toast";
import ProfileComponent from "../utils/ProfileComponent";
import { BASE_URL } from "../services/helper";

function Home({ socket }) {
  const { followerPost, loading } = useSelector((state) => state.post);
  const { currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState([]);
  const [sloading, setSloading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.emit("login", { userId: currentUser?._id });
  }, []);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        setSloading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/user/suggesteduser/user`,
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
          `${BASE_URL}/api/post/following/Post`,
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
    <div>
      <Navbar socket={socket} />
      <div className="flex z-50 pt-12 w-screen mx-auto">
        {!loading ? (
          <div className="hidden md:flex lg:w-1/3 md:w-[40%] p-2">
            <ProfileComponent currentUser={currentUser} />
          </div>
        ) : (
          <div className="lg:w-1/3 md:w-1/2"></div>
        )}
        {!loading ? (
          <div className="md:flex lg:w-1/3 md:w-[60%] mx-3 h-[calc(100vh-3rem)] w-screen">
            {followerPost?.length !== 0 ? (
              <div className="flex flex-col">
                {followerPost?.map((p) => (
                  <ExploreMore explore={p} key={p._id} />
                ))}
              </div>
            ) : (
              <div className="flex lg:items-start md:items-start items-center justify-center lg:pt-36 m-auto font-bold md:text-3xl h-[calc(100vh-2.7rem)] text-[#547bca]">
                No Post!Please Follow Someone
              </div>
            )}
          </div>
        ) : (
          <div className="flex md:w-1/2 flex-col h-[calc(100vh-2.3rem)]  lg:border-[#BED7F8]">
            <PostSkeleton />
          </div>
        )}

        <div className="hidden lg:flex w-1/3 lg:mr-[10rem] lg:ml-[2rem] md:w-60 h-[calc(100vh-3.5rem)] overflow-y-scroll ml-2 flex-col  mt-3 text-white ">
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
    </div>
  );
}

export default Home;
