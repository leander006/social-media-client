import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Pin from "../GridSystem/Pin";
import Navbar from "../utils/Navbar";
import { SpinnerCircular } from "spinners-react";
import Skeleton from "../Skeleton/Skeleton";
import axios from "axios";
import { loginError, loginStart, loginSuccess } from "../redux/Slice/userSlice";
import { BASE_URL } from "../services/helper";
// import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

function Profile({ socket }) {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [sloading, setSloading] = useState(false);
  const { userId } = useParams();
  const [follow, setFollow] = useState(false);
  const [user, setUser] = useState();
  const [post, setPost] = useState([]);
  const dispatch = useDispatch();
  const current = currentUser.others ? currentUser.others : currentUser;
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
        setSloading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/user/` + userId,
          config
        );
        setUser(data.user);
        setPost(data.post);
        setFollow(current?.following?.includes(data.user._id));
        setLoading(false);
        setSloading(false);
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    getPost();
    // eslint-disable-next-line
  }, [userId, follow]);

  const following = async (e) => {
    e.preventDefault();
    // toast.success("Successfully toasted!");
    dispatch(loginStart());
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/user/addFollower/${userId}`,
        {},
        config
      );
      console.log(follow);
      setFollow(!follow);
      localStorage.setItem("data", JSON.stringify(data));
      dispatch(loginSuccess(data));

      toast.success(`You ${follow ? "unfollowed" : "followed"} a user`);
    } catch (error) {
      dispatch(loginError());
      console.log(error?.response?.data);
    }
  };
  const sizeArray = ["sm", "md", "lg"];
  return (
    <>
      <Navbar socket={socket} />
      <div className="flex pt-9 w-screen mx-auto">
        {!loading ? (
          <div className="bg-[#2D3B58] h-[calc(100vh-2.5rem)] w-full flex flex-col ">
            <div className="flex flex-col w-screen bg-[#2D3B58] md:px-16 pt-6 text-white lg:w-[95vw]">
              <div className="flex lg:mx-36">
                <div className="p-1 pl-2 md:w-full flex justify-center flex-col items-center">
                  <img
                    className="rounded-full w-12 h-12 lg:w-[70px] lg:h-[70px]"
                    src={
                      user?.profile?.url ? user?.profile?.url : user?.profile
                    }
                    alt={
                      user?.profile?.url ? user?.profile?.url : user?.profile
                    }
                  />

                  <h1 className="ml-6 md:ml-0">{user?.username}</h1>
                  {userId !== currentUser?._id && (
                    <div className="flex mt-3 items-center">
                      {userId !== currentUser?._id && (
                        <div>
                          {follow ? (
                            <i
                              className="fa-solid fa-user-slash fa-xl  cursor-pointer"
                              onClick={following}
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-xl  fa-user-plus cursor-pointer"
                              onClick={following}
                            ></i>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col pt-2 pr-2 md:px-8 w-full">
                  <div className="flex justify-between w-full ">
                    <h1>{user?.postCount} post</h1>
                    <h1>{user?.followers.length} followers</h1>
                    <h1>{user?.following.length} following</h1>
                  </div>
                  <div className="p-2 mt-6 ">{user?.bio}</div>
                </div>
              </div>
            </div>
            {user?.postCount !== 0 ? (
              <div className="md:px-12 lg:px-12 bg-[#2D3B58] ">
                <div className="m-0 w-[50vw] md:w-[80vw] p-9 bg-[#2D3B58] justify-center md:grid md:absolute hidden auto-rows-2fr grid-cols-8">
                  {post.map((p) => (
                  <Pin
                      img={
                        p.content
                          ? p?.content
                          : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
                      }
                      id={p._id}
                      key={p._id}
                      size={sizeArray[Math.floor(Math.random() * 3)]}
                    />                                                                                             
                  ))}
                </div>
                {!sloading ? (
                  <div className="md:hidden px-4 py-2">
                    <div className="grid grid-cols-2 gap-2">
                      {post.map((p) => (
                        <Link key={p._id} to={"/singlepage/" + p._id}>
                          <img
                            className="transform transition duration-500 hover:scale-110 h-40 w-full cursor-pointer"
                            src={
                              p?.content?.url
                                ? p?.content?.url
                                : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
                            }
                            alt="profile"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Skeleton />
                )}
              </div>
            ) : (
              <div className="h-[calc(100vh-4.3rem)] flex mt-28 m-auto font-bold text-3xl md:h-[calc(100vh-2.7rem)] text-[#547bca]">
                No Post Available{" "}
              </div>
            )}
          </div>
        ) : (
          <SpinnerCircular
            size="90"
            className="bg-[#2D3B58] w-full flex items-center flex-col h-[calc(100vh-3rem)] mx-auto"
            thickness="100"
            speed="600"
            color="white"
            secondaryColor="black"
          />
        )}
      </div>
    </>
  );
}

export default Profile;
