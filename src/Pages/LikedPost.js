import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import Navbar from "../utils/Navbar";

import PostSkeleton from "../Skeleton/PostSkeleton";
import ExploreMore from "../utils/ExploreMore";
import { useSelector } from "react-redux";
import SearchFreind from "../utils/SearchFreind";
import axios from "axios";
import ProfileComponent from "../utils/ProfileComponent";
import { BASE_URL } from "../services/helper";
function LikedPost({ socket }) {
  const [loading, setLoading] = useState(false);

  const [likePost, setLikePost] = useState([]);
  const { currentUser, config } = useSelector((state) => state.user);

  const [search, setSearch] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/post/liked/Post`,
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
          `${BASE_URL}/api/user/followers/getAll`,
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
      <div className="flex mt-10">
        {!loading ? (
          <div className="hidden md:flex lg:w-1/3 md:w-[40%] p-2">
            <ProfileComponent currentUser={currentUser} />
          </div>
        ) : (
          <div className="lg:w-1/3 md:w-1/2"></div>
        )}
        {!loading ? (
          <div className="md:flex lg:w-1/3 md:w-[60%] mx-3 h-[calc(100vh-2.7rem)] w-screen">
            {likePost.length !== 0 ? (
              <div className="md:flex flex-col mx-3">
                <div className="flex justify-center font-bold text-xl text-[#547bca]">
                  Liked Post
                </div>
                {likePost?.map((p) => (
                  <ExploreMore explore={p} key={p._id} />
                ))}
              </div>
            ) : (
              <div className="flex lg:items-start md:items-start lg:mt-0 md:mt-28 items-center lg:pt-36 h-[calc(100vh-2.7rem)] justify-center font-bold md:text-3xl text-[#547bca]">
                No Post Liked!
              </div>
            )}
          </div>
        ) : (
          <div className="flex md:w-1/2 flex-col h-[calc(100vh-2.3rem)]  lg:border-[#BED7F8]">
            <PostSkeleton />
          </div>
        )}

        <div className="hidden lg:flex w-1/3 lg:mr-[10rem] lg:ml-[2rem] md:w-60 h-[calc(100vh-3.5rem)] overflow-y-scroll ml-2 flex-col  mt-3 text-white">
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
