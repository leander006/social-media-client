import React, { useEffect } from "react";
import ExploreMore from "../utils/ExploreMore";

import { useDispatch, useSelector } from "react-redux";
import {
  followerPostError,
  followerPostStart,
  followerPostSuccess,
} from "../redux/Slice/postSlice";

import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../services/helper";
import PostSkeleton from "../Skeleton/PostSkeleton";

function Home({ socket }) {
  const { followerPost, loading } = useSelector((state) => state.post);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.emit("login", { userId: currentUser?._id });
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    const getFollowersPost = async () => {
      try {
        dispatch(followerPostStart());
        const { data } = await axios.get(
          `${BASE_URL}/api/post/following/Post`,
        );
        dispatch(followerPostSuccess(data));
        // console.log("data", data);
      } catch (error) {
        dispatch(followerPostError());
        toast.error(error?.response?.data?.error || "Something went wrong");
        console.log("error ", error?.response?.data);
      }
    };
    getFollowersPost();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex w-full md:w-[80%] lg:w-[55%]">
        {!loading ? (
          <div className="flex flex-col w-full">
            {followerPost?.length !== 0 ? (
              followerPost?.map((p) => (
                <ExploreMore explore={p} key={p._id} />
              ))
            ) : (
              <p>No posts to display</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {followerPost?.map((p) => (
              <PostSkeleton key={p._id} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
