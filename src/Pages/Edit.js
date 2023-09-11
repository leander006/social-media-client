import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  loginError,
  loginStart,
  loginSuccess,
  logout,
} from "../redux/Slice/userSlice";
import Navbar from "../utils/Navbar";
import Cookie from "js-cookie";
import { SpinnerCircular } from "spinners-react";
import toast from "react-hot-toast";
import axios from "axios";

function Edit({ socket }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const [profile, setProfile] = useState("");
  const [selectedImg, setSelectedImg] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [fileInputState, setFileInputState] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  const { editId } = useParams();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookie.get("token")}`,
    },
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

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:3001/api/user/" + editId,
          config
        );
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    getPost();
    // eslint-disable-next-line
  }, [editId]);

  const handleImage = (e) => {
    e.preventDefault();
    if (!selectedImg) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };

    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      setLoad(true);
      const { data } = await axios.post(
        "http://localhost:3001/api/user/upload",
        { data: base64EncodedImage },
        config
      );
      console.log("data", data);
      setFileInputState("");
      setPreviewSource("");
      setProfile(data);
      setLoad(false);
      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      console.log("profile ", profile);
      const { data } = await axios.put(
        "http://localhost:3001/api/user/update/" + editId,
        {
          username: username,
          bio: bio,
          name: name,
          profile: profile,
          status: status,
          password: password,
        },
        config
      );
      dispatch(loginSuccess(data));
      navigate("/profile/" + editId);
    } catch (error) {
      dispatch(loginError());
      console.log(error?.response?.data);
    }
  };

  const log = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };
  return (
    <>
      <Navbar socket={socket} />
      <div className="flex bg-[#2D3B58] pt-9">
        {!loading ? (
          <div className="flex flex-col md:m-auto w-screen h-[calc(100vh-2.3rem)] md:pt-16 lg:w-[60%] md:w-[75%] md:h-[calc(100vh-2.7rem)] overflow-y-scroll">
            <div className="flex justify-between p-4 ">
              <div className="flex items-center space-x-5">
                <i
                  className="fa-solid fa-2xl fa-xmark cursor-pointer text-[#8aaaeb]"
                  onClick={() => navigate("/home")}
                ></i>
                <h1 className="font-bold text-xl">Edit profile</h1>
              </div>
              <div>
                <i
                  className="fa-solid fa-2xl cursor-pointer fa-check text-[#8aaaeb]"
                  onClick={handleSubmit}
                ></i>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              {!load ? (
                <img
                  className="image h-16 w-16 rounded-full "
                  src={
                    previewSource
                      ? previewSource
                      : profile?.url
                      ? profile?.url
                      : user?.profile?.url
                  }
                  alt="edit"
                />
              ) : (
                <SpinnerCircular
                  size="90"
                  className="bg-[#2D3B58] w-full flex items-center  md:h-56 h-28  flex-col  mx-auto"
                  thickness="100"
                  speed="600"
                  color="white"
                  secondaryColor="black"
                />
              )}

              {!selectedImg && (
                <label
                  className="text-[#8aaaeb] cursor-pointer hover:text-[#6795f1]"
                  htmlFor="forFile"
                >
                  Change Profile
                </label>
              )}
              <input
                type="file"
                id="forFile"
                accept="image/png , image/jpg, image/jpeg"
                style={{ display: "none" }}
                value={fileInputState}
                onChange={handleFileInputChange}
                name="file"
                required
              />
            </div>
            {selectedImg && !profile && (
              <div className="flex justify-center">
                <h1
                  className="bg-blue-600 active:bg-blue-400 cursor-pointer mt-2 text-white p-1 rounded"
                  onClick={handleImage}
                >
                  Upload image
                </h1>
              </div>
            )}
            <div className="bottom">
              <div className="p-2">
                <h1 className="text-[#8aaaeb] ">Name</h1>
                <input
                  className="bg-[#2D3B58] border-b w-full mt-2 outline-none"
                  placeholder={user?.name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                ></input>
              </div>

              <div className="p-2">
                <h1 className="text-[#8aaaeb] ">Username</h1>
                <input
                  className="bg-[#2D3B58] border-b w-full mt-2 outline-none"
                  placeholder={user?.username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                ></input>
              </div>

              <div className="p-2">
                <h1 className="text-[#8aaaeb] ">Password</h1>
                <input
                  className="bg-[#2D3B58] border-b w-full mt-2 outline-none"
                  placeholder={"*****"}
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"
                ></input>
              </div>

              <div className="p-2">
                <h1 className="text-[#8aaaeb] ">Bio</h1>
                <textarea
                  className="bg-[#2D3B58] border-b w-full mt-2 outline-none"
                  placeholder={user?.bio}
                  onChange={(e) => setBio(e.target.value)}
                  type="text"
                ></textarea>
              </div>
              <div className="p-2">
                <h1 className="text-[#8aaaeb] ">Status</h1>
                <div className="flex space-x-3 text-[#437df0]">
                  <input
                    type="radio"
                    id="html"
                    name="fav_language"
                    onChange={(e) => setStatus(e.target.value)}
                    value="Private"
                  />
                  <label htmlFor="html">Private</label>
                  <br />
                  <input
                    type="radio"
                    id="css"
                    name="fav_language"
                    onChange={(e) => setStatus(e.target.value)}
                    value="Public"
                  />
                  <label htmlFor="css">Public</label>
                  <br></br>
                </div>
              </div>
            </div>
            <div className="flex text-lg font-bold ml-2 mt-2 text-[#8aaaeb]">
              <h1 className="cursor-pointer" onClick={log}>
                Switch account
              </h1>
            </div>
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

export default Edit;
