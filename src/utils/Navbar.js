import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../redux/Slice/userSlice";
import axios from "axios";

import {
  notifcationError,
  notifcationStart,
  notifcationSuccess,
} from "../redux/Slice/notificationSlice";
import Notifcations from "./Notifcations";
import { BASE_URL } from "../services/helper";

function Navbar() {
  const [search, setSearch] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results

  const navigate = useNavigate();
  const [notify, setNotify] = useState(false);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { allNoti } = useSelector((state) => state.notification);


  useEffect(() => {
    const getNotifications = async () => {
      dispatch(notifcationStart());
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/notification`,
        );
        dispatch(notifcationSuccess(data));
      } catch (error) {
        dispatch(notifcationError());
        console.log("error ", error);
      }
    };
    getNotifications();
    // eslint-disable-next-line
  }, [currentUser, notify]);

  const log = (e) => {
    e.preventDefault();
    dispatch(logout());
    window.open(`${BASE_URL}/api/auth/google/logout`, "_self");
    navigate("/");
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Debounce the search API call
    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/freind/search`, {
          params: { name: query },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout); // Clear timeout on every new input
  };

  const current = currentUser?.others ? currentUser?.others : currentUser;

  return (
    <div className="fixed w-full h-16 bg-[#2f3549] z-50">
      <div className="flex w-full h-full justify-between items-center">
        <div className="ml-3">
          <Link to="/home">
            <h1 className="text-white hidden md:flex text-xl">Instawave</h1>
          </Link>
          <i onClick={() => setVisible(!visible)} className="md:hidden fa-solid fa-xl text-[#BED7F8] fa-bars"></i>
        </div>
        {search && searchResults.length > 0 && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg w-96 z-50">
            <ul>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    navigate(`/profile/${result._id}`);
                    setSearch("");
                  }}
                >
                  {result.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="hidden md:flex md:w-96 xl:w-[505px] items-center bg-white rounded-xl p-1">
          <i className="fa-solid fa-xl text-[#2f3549] fa-magnifying-glass"></i>
          <input value={search}
            onChange={handleSearchChange} className="p-0.5 m-1 w-full focus:outline-none" placeholder="Search Friends" type="text" />
        </div>
        <div className="mr-2 flex items-center space-x-4 text-[#BED7F8] ">
          <i className="fa-solid fa-xl fa-bell cursor-pointer"></i>
          <Link to="/chat">
            <i className="fa-solid fa-xl fa-message cursor-pointer"></i>
          </Link>
          <Link to={"/profile/" + current?._id}>
            <div className="cursor-pointer">
              <img
                className="rounded-full w-9 h-9 p-1"
                src={
                  current?.profile?.url
                    ? current?.profile?.url
                    : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
                }
                alt={
                  current?.profile?.url
                    ? current?.profile?.url
                    : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.1772660598.1694933442&semt=ais"
                }
              />
            </div>
          </Link>
          <div onClick={log} className="cursor-pointer">
            <i className="fa-solid fa-xl fa-arrow-right-from-bracket"></i>
          </div>
        </div>
        {visible &&
          <div className="md:hidden z-50 fixed bg-[#2f3549] text-white top-0 h-full w-48">
            <div onClick={() => setVisible(!visible)} className="flex w-full items-center justify-between pt-5">
              <Link className="ml-2" to="/home">Instawave</Link>
              <i className="fa-solid fa-2xl text-[#BED7F8] fa-xmark mr-2 cursor-pointer"></i>
            </div>
            <div className="ml-2 flex flex-col mt-8 space-y-8">
              <Link to="/home">
                <div onClick={() => setVisible(!visible)} className="flex items-center">
                  <i className="fa-solid fa-house mr-2"></i>
                  <h1>Home</h1>
                </div>
              </Link>
              <Link to="/explore">
                <div onClick={() => setVisible(!visible)} className="flex items-center">
                  <i className="fa-solid fa-play mr-2"></i>
                  <h1>Explore</h1>
                </div>
              </Link>
              <Link to="/savedPost">
                <div onClick={() => setVisible(!visible)} className="flex items-center">
                  <i className="fa-solid fa-bookmark mr-2"></i>
                  <h1>Saved Post</h1>
                </div>
              </Link>
              <Link to="/like">
                <div onClick={() => setVisible(!visible)} className="flex items-center">
                  <i className="fa-solid fa-thumbs-up mr-2"></i>
                  <h1>Liked Post</h1>
                </div>
              </Link>
              <Link to={"/edit/" + current._id}>
                <div onClick={() => setVisible(!visible)} className="flex items-center">
                  <i className="fa-solid fa-pen-to-square mr-2"></i>
                  <h1>Edit</h1>
                </div>
              </Link>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Navbar;
