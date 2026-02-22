import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postError, postStart, postSuccess } from "../redux/Slice/postSlice";
import Pin from "../GridSystem/Pin";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import { Link } from "react-router-dom";
import Skeleton from "../Skeleton/Skeleton";

const sizeArray = ["sm", "md", "lg"];

function Explore() {


  const dispatch = useDispatch();

  const { allpost, loading } = useSelector((state) => state.post);

  useEffect(() => {
    const getAllPost = async () => {
      try {
        dispatch(postStart());
        const { data } = await axios.get(`${BASE_URL}/api/post`);
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
      <div className="flex md:w-[85%]">
        <div className="flex flex-col mb-4 w-full">
          {/* <div className="flex md:hidden ml-5 mt-2 items-center bg-slate-200 rounded-md">
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
          </div> */}

          {!loading ? (
            <div className="hidden  bg-[#2D3B58]  justify-center  md:grid auto-rows-2fr grid-cols-2">
              {allpost?.map((p) => (
                <Pin
                  display={false}
                  img={
                    p?.content
                      ? p?.content
                      : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
                  }
                  id={p?._id}
                  key={p?._id}
                  size={sizeArray[Math.floor(Math.random() * 3)]}
                />
              ))}
            </div>
          ) : (
            <div className="hidden  bg-[#2D3B58]  justify-center md:absolute md:grid auto-rows-2fr grid-cols-2">
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
            <div className=" md:hidden bg-[#2D3B58] w-full p-2 ">
              <div className="grid grid-cols-2 gap-2">
                {allpost.map((p) => (
                  <Link key={p?._id} to={"/singlepage/" + p._id}>
                    <img
                      className="transform transition duration-500 hover:scale-110 h-40 w-full cursor-pointer"
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
