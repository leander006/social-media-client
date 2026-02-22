import React, { useEffect, useState } from "react";

import PostSkeleton from "../Skeleton/PostSkeleton";
import ExploreMore from "../utils/ExploreMore";
import axios from "axios";
import { BASE_URL } from "../services/helper";
function LikedPost() {
  const [loading, setLoading] = useState(false);

  const [likePost, setLikePost] = useState([]);


  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };
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


  return (
    <>
      <div className="flex w-full md:w-[80%] lg:w-[55%]">
        {!loading ? (
          <div className="flex flex-col w-full ">
            {likePost.length !== 0 ? (
              <div className="md:flex flex-col mx-3">
                <div className="flex justify-center font-bold text-xl text-[#547bca]">
                  Liked Post
                </div>
                {likePost?.map((l) => (
                  <ExploreMore explore={l} key={l._id} />
                ))}
              </div>
            ) : (
              <div className="flex lg:items-start md:items-start lg:mt-0 md:mt-28 items-center lg:pt-36 pt-32 justify-center font-bold md:text-3xl text-[#547bca]">
                No Post Liked!
              </div>
            )}
          </div >
        ) : (
          <div className="flex flex-col w-full">
            {likePost?.map((l) => (
              <PostSkeleton key={l._id} />
            ))}
          </div>
        )
        }

      </div >
    </>
  );
}

export default LikedPost;
