import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import Navbar from "../utils/Navbar";

import PostSkeleton from "../Skeleton/PostSkeleton";
import ExploreMore from "../utils/ExploreMore";
import { useSelector } from "react-redux";
import SearchFreind from "../utils/SearchFreind";
import axios from "axios";

function LikedPost({ socket }) {
  const [loading, setLoading] = useState(false);

  const [likePost, setLikePost] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const [search, setSearch] = useState([]);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookie.get("token")}`,
    },
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:3001/api/post/liked/Post",
          config
        );
        setLoading(false);
        setLikePost(data);
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    getPost();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/user/followers/getAll",
          config
        );
        setSearch(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar socket={socket} />
      <div className="flex bg-[#2D3B58]  mt-10">
        {!loading ? (
          <div className="main md:flex mx-auto lg:basis-[70%] md:basis-[60%] ">
            {likePost.length !== 0 ? (
              <div className="flex flex-col h-[calc(100vh-2.7rem)] overflow-y-scroll lg:pl-[17rem] md:pr-5 md:pt-2 md:pb-12 ">
                <div className="mx-auto font-bold text-xl text-[#547bca]">
                  Liked Post
                </div>
                {likePost?.map((p) => (
                  <ExploreMore explore={p} key={p._id} />
                ))}
              </div>
            ) : (
              <div className="h-[calc(100vh-2.7rem)] lg:basis-[70%]  justify-center flex items-center lg:items-start lg:pt-36 m-auto font-bold md:text-3xl text-[#547bca]">
                No Post Liked!
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-2.3rem)]  lg:border-[#BED7F8]">
            <PostSkeleton />
          </div>
        )}

        <div className="hidden lg:flex basis-[30%] lg:mr-[10rem] lg:ml-[2rem] md:w-60 h-[calc(100vh-3.5rem)] overflow-y-scroll lg:w-80 xl:w-96 ml-2 flex-col text-white ">
          {currentUser.followers.length !== 0 ? (
            <div>
              <h1>Followers</h1>
              {search.map((s) => (
                <SearchFreind search={s} key={s._id} />
              ))}
            </div>
          ) : (
            <div>No one followers you!</div>
          )}
        </div>
      </div>
    </>
  );
}

export default LikedPost;
