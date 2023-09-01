import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Cookie from "js-cookie";
import PostSkeleton from "../Skeleton/PostSkeleton";
import ExploreMore from "../ExploreMore";
import SearchFreind from "../SearchFreind";
import { useSelector } from "react-redux";
import axios from "axios";

function YourPosts() {
  const [loading, setLoading] = useState(false);
  const [bookmarkPost, setBookmarkPost] = useState([]);

  const [search, setSearch] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
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
          "http://localhost:3001/api/post/bookmark/Post",
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
          "http://localhost:3001/api/user/following/getAll",
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
      <Navbar />
      <div className="flex bg-[#2D3B58]  mt-10">
        {!loading ? (
          <div className="main md:flex mx-auto lg:basis-[70%] md:basis-[60%] ">
            {bookmarkPost.length !== 0 ? (
              <div className="flex flex-col md:pt-2 md:pb-12 h-[calc(100vh-2.7rem)] overflow-y-scroll lg:pl-[17rem] md:pr-5 ">
                <div className="mx-auto font-bold p-1.5 text-xl text-[#547bca]">
                  Saved Post
                </div>
                {bookmarkPost?.map((p) => (
                  <ExploreMore explore={p} key={p._id} />
                ))}
              </div>
            ) : (
              <div className="h-[calc(100vh-2.7rem)] lg:basis-[70%]  justify-center flex items-center lg:items-start lg:pt-36 m-auto font-bold md:text-3xl text-[#547bca]">
                No Post Saved!
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-2.3rem)]  lg:border-[#BED7F8]">
            <PostSkeleton />
          </div>
        )}
        <div className="hidden lg:flex basis-[30%] lg:mr-[10rem] lg:ml-[2rem] md:w-60  h-[calc(100vh-3.7rem)] overflow-y-scroll lg:w-80 xl:w-96 ml-2 flex-col text-white ">
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
