import React, { useEffect, useState } from "react";
import PostSkeleton from "../Skeleton/PostSkeleton";
import ExploreMore from "../utils/ExploreMore";
import axios from "axios";
import { BASE_URL } from "../services/helper";

function YourPosts() {
  const [loading, setLoading] = useState(false);
  const [bookmarkPost, setBookmarkPost] = useState([]);


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


  return (
    <>
      <div className="flex w-full md:w-[80%] lg:w-[55%]">
        {!loading ? (
          <div className="flex flex-col w-full">
            {bookmarkPost.length !== 0 ? (
              <div className="md:flex flex-col mx-3">
                <div className="flex justify-center font-bold text-xl text-[#547bca]">
                  Saved Post
                </div>
                {bookmarkPost?.map((b) => (
                  <ExploreMore explore={b} key={b._id} />
                ))}
              </div>
            ) : (
              <div className="flex lg:items-start md:items-start lg:mt-0 md:mt-28 items-center lg:pt-36 pt-32 justify-center font-bold md:text-3xl text-[#547bca]">
                No Post Saved!
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {bookmarkPost?.map((b) => (
              <PostSkeleton key={b._id} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default YourPosts;
