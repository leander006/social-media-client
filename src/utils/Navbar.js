import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SearchFreind from "./SearchFreind";

import { logout } from "../redux/Slice/userSlice";
import axios from "axios";

import {
  notifcationError,
  notifcationStart,
  notifcationSuccess,
} from "../redux/Slice/notificationSlice";
import Notifcations from "./Notifcations";
import { BASE_URL } from "../services/helper";
import { imageSuccess } from "../redux/Slice/imageSlice";

function Navbar({ socket }) {
  const [searched, setSearched] = useState("");
  const [search, setSearch] = useState([]);
  const navigate = useNavigate();
  const [notify, setNotify] = useState(false);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(false)
  const { currentUser } = useSelector((state) => state.user);
  const { allNoti } = useSelector((state) => state.notification);
  const { url } = useSelector((state) => state.image);
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedImg, setSelectedImg] = useState("");
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };

  useEffect(() => {
    const getNotifications = async () => {
      dispatch(notifcationStart());
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/notification`,
          config
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
    socket?.emit("removeUser", { userId: currentUser?._id });
    window.open(`${BASE_URL}/api/auth/google/logout`, "_self");
    navigate("/");
  };


  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedImg(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };


  const handleSearch = async (query) => {
    setSearched(query);
    if (!query) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/user/oneUser?name=` + searched,
        config
      );
      setSearch(data);
    } catch (error) {
      console.log(error);
    }
  };

  const next = async() =>{
    dispatch(imageSuccess(selectedImg));
  }

  const current = currentUser?.others ? currentUser?.others : currentUser;

  return (
    <div className="container fixed top-0 z-50 ">
      <div className="flex justify-between md:justify-evenly bg-[#455175] w-screen">
        <div className="font-bold p-2 text-white">
          <Link to="/home">
            <h1>InstaWave</h1>
          </Link>
        </div>

        <div className="md:flex hidden h-8 w-1/3 m-auto mt-1 items-center bg-[#455175] rounded-md">
          <input
            className="rounded-md focus:outline-[#BED7F8] w-full h-full p-1"
            value={searched}
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="search your friends"
          ></input>
        </div>

        <div className=" hidden md:flex fixed z-30 lg:mr-44 md:mr-28  mt-12 bg-[#a1bcf1]">
          <div className="md:w-64 lg:w-80 xl:w-96 ">
            {search?.map((s) => (
              <SearchFreind key={s._id} search={s} setSearch={setSearch} />
            ))}
          </div>
        </div>
        <div className="flex items-center text-white mx-2 lg:space-x-4">
          <div className="flex mr-2 ">
            <Link to="/home">
              <i className="fa-solid  text-[#BED7F8] cursor-pointer fa-xl  fa-house"></i>
            </Link>
          </div>

          <div className="flex mr-2 ">
            <Link to="/chat">
              <i className="fa-regular  text-[#BED7F8] cursor-pointer fa-xl  fa-comment"></i>
            </Link>
          </div>
          <div className="flex mr-2 ">
            <Link to="/explore">
              <i className="fa-regular text-[#BED7F8] cursor-pointer fa-xl  fa-circle-play"></i>
            </Link>
          </div>
          <div className="mr-2 text-[#BED7F8] cursor-pointer">
            <div onClick={ () =>setDisplay(true)}>
              <i className="fa-solid fa-xl fa-square-plus"></i>
            </div>
          </div>
          <div className="cursor-pointer" onClick={(e) => setVisible(!visible)}>
            {/* <img src="" alt="" srcset="" /> */}
            <img
              className="rounded-full w-10 h-10 p-1"
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
          <div
            className="relative text-[#BED7F8] cursor-pointer"
            onClick={() => setNotify(!notify)}
          >
            <i className="fa-solid fa-xl fa-bell"></i>
            {allNoti.length > 0 && (
              <h1 className="font-bold absolute -top-1 bg-red-600 rounded-full w-4 h-4 text-white flex justify-center items-center">
                {allNoti.length}
              </h1>
            )}
          </div>

          {notify && allNoti.length > 0 && (
            <div className="flex fixed z-30 right-3 top-8 bg-[#a1bcf1]">
              <div className="px-3 py-1">
                {allNoti?.map((n) => (
                  <Notifcations
                    setNotify={setNotify}
                    notify={notify}
                    n={n}
                    key={n?._id}
                  />
                ))}
              </div>
            </div>
          )}

          {visible && (
            <div className="z-50 fixed bg-[#98aef0] flex justify-center flex-col text-black  px-2 h-48 mt-56 w-44 right-3 rounded-md">
              <Link to={"/profile/" + current._id}>
                <div className="flex items-center my-2 cursor-pointer w-screen">
                  <i className="fa-regular fa-xl fa-user mr-3"></i>
                  <h1>Profile</h1>
                </div>
              </Link>
              <Link to="/savedPost">
                <div className="flex items-center my-2 cursor-pointer w-screen">
                  <i className="fa-regular fa-xl fa-bookmark mr-4"></i>
                  <h1>Saved</h1>
                </div>
              </Link>
              <Link to="/like">
                <div className="flex items-center my-2 cursor-pointer w-screen">
                  <i className="fa-regular mr-3 fa-xl  fa-heart"></i>
                  <h1>Liked</h1>
                </div>
              </Link>
              <Link to={"/edit/" + current._id}>
                <div className="flex items-center my-2 cursor-pointer w-screen">
                  <i className="fa-solid fa-xl mr-3 fa-gear"></i>
                  <h1>Setting</h1>
                </div>
              </Link>
              <div
                className="flex items-center my-2 cursor-pointer w-full"
                onClick={log}
              >
                <i className="fa-solid mr-3 cursor-pointer fa-xl fa-arrow-right-from-bracket "></i>
                <h1>Logout</h1>
              </div>
            </div>
          )}
        </div>
      </div>

      {
        display && 
        <div className="flex flex-col items-center justify-center h-screen">
          <div className={!previewSource?"bg-[#435280] shadow-lg  w-[93%] md:w-1/2 h-[340px] md:h-[540px] flex flex-col items-center justify-between rounded-lg text-center text-white":"shadow-lg  w-[93%] md:w-1/2 h-[340px] md:h-[540px] flex flex-col items-center justify-center rounded-lg text-center text-white"}>
          {previewSource &&
          <div className="flex w-full justify-between text-white mb-1">
              <div onClick={() =>{setPreviewSource("") ;setFileInputState("")}}>
                <i className="fa-solid fa-arrow-left fa-xl cursor-pointer"></i>
              </div>
              <div onClick={next}>
                 <h1 className=" cursor-pointer text-xl">Next</h1> 
              </div>
          </div>
          }
          {
            !previewSource && 
            <div onClick={() => setDisplay(!display)} className="flex w-full justify-start text-white ml-3">
                <i className="fa-solid fa-xmark text-2xl"></i>
            </div>
          }
            {
            !previewSource ?<div  className="flex flex-col">
              <i className="fa-solid fa-2xl fa-photo-film cursor-pointer mb-2"></i>
              <label
                className="mt-4 bg-[#798abe] p-2 rounded-lg cursor-pointer"
                htmlFor="forFile"
              >
                Select from device
              </label>
            
            <input
              type="file"
              id="forFile"
              accept="image/png , image/jpg, image/jpeg ,video/mp4"
              value={fileInputState}
              onChange={handleFileInputChange}
              style={{ display: "none" }}bvchchchghg
              name="file"
            />
            </div>:
            <img
                className="h-full w-full object-cover"
                src={previewSource}
                alt="write"
              />
          }
          <div>
            </div>
          </div> 
          
        </div>
      }
    </div>
  );
}

export default Navbar;
