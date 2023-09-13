import React, { useEffect, useState } from "react";
import Navbar from "../utils/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { postError, postStart, postSuccess } from "../redux/Slice/postSlice";
import Pin from "../GridSystem/Pin";
import Skeleton from "../Skeleton/Skeleton";
import SearchFreind from "../utils/SearchFreind";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../services/helper";

const sizeArray = ["sm", "md", "lg"];

function Explore({ socket }) {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState([]);

  const dispatch = useDispatch();
  const { config } = useSelector((state) => state.user);
  const { allpost, loading } = useSelector((state) => state.post);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/user/oneUser?name=` + search,
        config
      );
      setSearched(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllPost = async () => {
      try {
        dispatch(postStart());
        const { data } = await axios.get(`${BASE_URL}/api/post`, config);
        dispatch(postSuccess(data));
      } catch (error) {
        dispatch(postError());
        console.log(error?.response?.data);
      }
    };
    getAllPost();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar socket={socket} />
      <div className="flex z-50 pt-9">
        <div className="flex flex-col mb-4">
          <div className="flex md:hidden ml-5 mt-2 w-[90vw] items-center bg-slate-200 rounded-md">
            <input
              className="rounded-md w-full m-2 p-1"
              type="text"
              placeholder="search your friends"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex lg:hidden fixed z-30 ml-6 mt-12 bg-[#a1bcf1] ">
            <div className="w-96 ">
              {searched?.map((s) => (
                <SearchFreind key={s?._id} search={s} />
              ))}
            </div>
          </div>

          {!loading ? (
            <div className="hidden w-screen bg-[#2D3B58] md:h-[calc(100vh-2.25rem)] overflow-y-scroll justify-center md:absolute md:grid auto-rows-2fr grid-cols-8">
              {allpost?.map((p) => (
                <Pin
                  display={false}
                  img={p?.content}
                  id={p?._id}
                  key={p?._id}
                  size={sizeArray[Math.floor(Math.random() * 3)]}
                />
              ))}
            </div>
          ) : (
            <div className="hidden w-screen bg-[#2D3B58] md:h-[calc(100vh-2.25rem)] overflow-y-scroll justify-center md:absolute md:grid auto-rows-2fr grid-cols-8">
              {allpost?.map((p) => (
                <Pin
                  display={true}
                  url={p?.content}
                  id={p?._id}
                  key={p?._id}
                  size={sizeArray[Math.floor(Math.random() * 3)]}
                />
              ))}
            </div>
          )}

          {!loading ? (
            <div className="w-screen md:hidden bg-[#2D3B58] h-[calc(100vh-6.75rem)] overflow-y-scroll p-2 grid grid-rows-3 grid-flow-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                {allpost.map((p) => (
                  <Link key={p?._id} to={"/singlepage/" + p._id}>
                    <img
                      className="transform transition duration-500 hover:scale-110 h-36 cursor-pointer"
                      src={p?.content?.url}
                      alt="explore"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
    </>
  );
}

export default Explore;
