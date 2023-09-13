import React, { useEffect, useState } from "react";
import Navbar from "../utils/Navbar";
import Cookie from "js-cookie";
import PostSkeleton from "../Skeleton/PostSkeleton";
import ExploreMore from "../utils/ExploreMore";
import SearchFreind from "../utils/SearchFreind";
import { useSelector } from "react-redux";
import axios from "axios";
import ProfileComponent from "../utils/ProfileComponent";
import { BASE_URL } from "../services/helper";

function YourPosts({ socket }) {
  const [loading, setLoading] = useState(false);
  const [bookmarkPost, setBookmarkPost] = useState([]);

  const [search, setSearch] = useState([]);
  const { currentUser, config } = useSelector((state) => state.user);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/post/bookmark/Post`,
          config
        );
        setBookmarkPost(data);
        setLoading(false);
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
          `${BASE_URL}/api/user/following/getAll`,
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
            {bookmarkPost.length !== 0 ? (
              <div className="md:flex flex-col mx-3">
                <div className="flex justify-center font-bold text-xl text-[#547bca]">
                  Saved Post
                </div>
                {bookmarkPost?.map((p) => (
                  <ExploreMore explore={p} key={p._id} />
                ))}
              </div>
            ) : (
              <div className="flex lg:items-start md:items-start lg:mt-0 md:mt-28 items-center lg:pt-36 h-[calc(100vh-2.7rem)] justify-center font-bold md:text-3xl text-[#547bca]">
                No Post Saved!
              </div>
            )}
          </div>
        ) : (
          <div className="flex md:w-1/2 flex-col h-[calc(100vh-2.3rem)]  lg:border-[#BED7F8]">
            <PostSkeleton />
          </div>
        )}

        <div className="hidden lg:flex w-1/3 lg:mr-[10rem] lg:ml-[2rem] md:w-60 h-[calc(100vh-3.5rem)] overflow-y-scroll ml-2 flex-col  mt-3 text-white">
          {currentUser?.following?.length !== 0 ? (
            <div>
              <h1>Followings</h1>
              {search.map((s) => (
                <SearchFreind search={s} key={s._id} />
              ))}
            </div>
          ) : (
            <div>You don't follow anyone!</div>
          )}
        </div>
      </div>
    </>
  );
}

export default YourPosts;
