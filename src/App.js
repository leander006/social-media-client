import Explore from "./Pages/Explore";

import Home from "./Pages/Home";
import { Routes, Route, useNavigate, Link, useParams, useLocation } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import axios from "axios";
import LikedPost from "./Pages/LikedPost";
import SavedPost from "./Pages/SavedPost";
import Profile from "./Pages/Profile";
import { toast } from "react-hot-toast";
import Chat from "./Pages/Chat";
import Write from "./Pages/Write";
import Edit from "./Pages/Edit";
import EmailVerificatiion from "./Pages/EmailVerificatiion";
import SinglePage from "./Pages/SinglePage";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { BASE_URL } from "./services/helper";
import { useEffect, useState } from "react";
import { loginError, loginStart, loginSuccess } from "./redux/Slice/userSlice";
import { followerPostError, followerPostStart, followerPostSuccess } from "./redux/Slice/postSlice";
import { SpinnerCircular } from "spinners-react";
import Navbar from "./utils/Navbar";
import InputEmoji from 'react-input-emoji'

axios.defaults.withCredentials = true;
const Endpoint = `${BASE_URL}/`;
function App() {
  const { currentUser } = useSelector((state) => state.user);
  const socket = io(Endpoint);

  const [search, setSearch] = useState([]);
  const [sloading, setSloading] = useState(false);
  const [display, setDisplay] = useState(false)
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedImg, setSelectedImg] = useState("");
  const [caption, setCaption] = useState("");
  const location = useLocation(); // Get the current location object

  const currentPath = location.pathname.split("/")[1]; // This will give 'home' for '/home'

  const dispatch = useDispatch();
  const socails = [
    {
      id: 1,
      child: (
        <>
          <i className="fa-brands fa-xl  fa-linkedin"></i>
        </>
      ),
      href: "https://www.linkedin.com/in/leander06/",
    },
    {
      id: 2,
      child: (
        <>
          <i className="fa-solid fa-xl fa-envelope"></i>
        </>
      ),
      href: "mailto:leanderdsilva06@gmail.com",
    },
    {
      id: 3,
      child: (
        <>
          <i className="fa-brands fa-xl fa-github"></i>
        </>
      ),
      href: "https://github.com/leander006",
    },
    {
      id: 4,
      child: (
        <>
          <i className="fa-brands fa-xl fa-instagram"></i>
        </>
      ),
      href: "https://www.instagram.com/leander_dsilva06/",
    },
  ];
  const [textAreaCount, setTextAreaCount] = useState("0/180");
  const max = 180;

  useEffect(() => {
    socket?.emit("login", { userId: currentUser?._id });
    // eslint-disable-next-line
  }, []);

  const recalculate = (text) => {
    const currentLength = text.length;
    setTextAreaCount(`${currentLength}/${max}`);
    setCaption(text)
  };

  const handleImage = async () => {
    return new Promise((resolve, reject) => {
      if (!selectedImg) return reject("No image provided");
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject("Error reading file");
      };
    });
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/post/postUpload/postImg`,
        { data: base64EncodedImage });
      return data;
    } catch (err) {
      setSloading(false);
      console.error(err);
      toast.error("An error occurred during submission");
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedImg) {
        console.log("no image");

        return;
      }
      setSloading(true);

      const base64Image = await handleImage();

      const uploadedImageData = await uploadImage(base64Image);

      await axios.post(
        `${BASE_URL}/api/post`,
        { content: uploadedImageData, caption: caption },
      );

      setSloading(false);
      setCaption("");
      setDisplay(!display);
      toast.success("Post created");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during submission");
    }
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
    const fetchUser = async () => {
      dispatch(loginStart());
      try {
        const res = await axios.get(`${BASE_URL}/api/user/me`);
        dispatch(loginSuccess(res.data));
      } catch {
        dispatch(loginError());
      }
    };

    fetchUser();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {
        currentUser == null ?
          <Routes>
            <Route
              path="/*"
              element={currentUser != null ? <Home socket={socket} /> : <Login />}
            />
            <Route path="/register" element={<Register />} />

          </Routes>
          :
          <>
            <Navbar />
            <div className=" h-[calc(100vh-4rem)] overflow-y-hidden w-full top-16 relative z-0 ">
              <div className="w-full flex h-full">
                {/* Left Sidebar */}
                <div className="md:w-[30%] lg:w-[20%] bg-[#2f3549] h-full overflow-y-auto text-[#BED7F8] hidden md:flex flex-col">
                  <div className="flex flex-col w-full space-y-2">
                    <Link to="/home">
                      <div className="flex items-center hover:bg-slate-500 pl-2 p-2">
                        <i className="fa-solid fa-house mr-2"></i>
                        <h1>Home</h1>
                      </div>
                    </Link>
                    <Link to="/explore">
                      <div className="flex items-center hover:bg-slate-500 pl-2 p-2">
                        <i className="fa-solid fa-play mr-2"></i>
                        <h1>Explore</h1>
                      </div>
                    </Link>
                    <Link to="/savedPost">
                      <div className="flex items-center hover:bg-slate-500 pl-2 p-2">
                        <i className="fa-solid fa-bookmark mr-2"></i>
                        <h1>Saved Post</h1>
                      </div>
                    </Link>
                    <Link to="/like">
                      <div className="flex items-center hover:bg-slate-500 pl-2 p-2">
                        <i className="fa-solid fa-thumbs-up mr-2"></i>
                        <h1>Liked Post</h1>
                      </div>
                    </Link>
                    <Link to={"/edit/" + currentUser?._id}>
                      <div className="flex items-center hover:bg-slate-500 pl-2 p-2">
                        <i className="fa-solid fa-pen-to-square mr-2"></i>
                        <h1>Edit</h1>
                      </div>
                    </Link>
                  </div>

                  <div className="bg-[#23293d] p-2 rounded-lg border-[#BED7F8] w-full mt-32">
                    <p className="leading-relaxed"> Copyright &copy; 2026 All rights reserved by Leander Dsilva</p>
                    <div className="flex cursor-pointer mt-6 mb-3">
                      {socails.map(({ child, id, href }) => (
                        <li
                          key={id}
                          className="flex mx-2 list-none hover:scale-125 duration-300"
                        >
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center"
                          >
                            {child}
                          </a>
                        </li>
                      ))}
                    </div>

                  </div>
                </div>
                {/* Main Content */}
                <div className={`w-full md:w-[70%] lg:w-[60%] h-full ${currentPath === "chat" ? "" : "overflow-y-auto"} `}>
                  {currentPath === "home" && <div className="w-full flex items-center  justify-center p-2 mt-2">
                    <div className="flex w-full md:w-[85%] 2xl:justify-between justify-center items-center rounded-lg">
                      <div className="w-full m-3 mr-3">
                        <div className="flex items-center bg-[#455175] mb-1 lg:mb-2 rounded-md w-full">
                          <div
                            className="w-full "
                          >
                            <InputEmoji
                              value={caption}
                              onChange={recalculate}
                              cleanOnEnter
                              maxLength={max}
                              placeholder="Write a caption..."
                            />
                          </div>
                          <p className="w-[20%] md:text-center mr-1">{textAreaCount}</p>
                          <div onClick={() => { setDisplay(true) }}>
                            <i className="fa-solid fa-2xl fa-square-plus mr-2 text-[#BED7F8] cursor-pointer"></i>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>}
                  <div className="w-full flex items-center justify-center p-2 mt-2">
                    <Routes>
                      <Route
                        path="/"
                        element={currentUser ? <Home socket={socket} /> : <Login />}
                      />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/home"
                        element={currentUser ? <Home socket={socket} /> : <Login />}
                      />
                      <Route
                        path="/like"
                        element={currentUser ? <LikedPost socket={socket} /> : <Login />}
                      />
                      <Route
                        path="/profile/:userId"
                        element={currentUser ? <Profile /> : <Login />}
                      />
                      <Route
                        path="/savedPost"
                        element={currentUser ? <SavedPost /> : <Login />}
                      />
                      <Route
                        path="/chat"
                        element={currentUser ? <Chat socket={socket} /> : <Login />}
                      />
                      <Route
                        path="/explore"
                        element={currentUser ? <Explore /> : <Login />}
                      />
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/edit/:editId"
                        element={currentUser ? <Edit /> : <Login />}
                      />
                      <Route
                        path="/singlepage/:postId"
                        element={currentUser ? <SinglePage /> : <Login />}
                      />
                      <Route
                        path="/users/:id/verify/:token"
                        element={currentUser ? <EmailVerificatiion /> : <Login />}
                      />
                    </Routes>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="bg-[#2f3549] w-[20%] h-full lg:flex hidden">
                  <div className="w-full px-2">
                    <div className="text-[#BED7F8]">
                      <h1 className="text-xl">Groups you can join</h1>
                      <div className="flex items-center my-6">
                        <img className="w-8 h-8 rounded-full" src="https://res.cloudinary.com/dj-sanghvi-college/image/upload/v1735990505/m4741xh2lsw69khbeaz9.jpg" alt="images of friends" />
                        <h1 className=" text-xl ml-2">Gaming zone</h1>
                      </div>
                      <div className="flex items-center">
                        <img className="w-8 h-8 rounded-full" src="https://res.cloudinary.com/dj-sanghvi-college/image/upload/v1735990505/m4741xh2lsw69khbeaz9.jpg" alt="images of friends" />
                        <h1 className=" text-xl ml-2">Avenger Assemble</h1>
                      </div>
                      <div className="flex items-center my-6">
                        <img className="w-8 h-8 rounded-full" src="https://res.cloudinary.com/dj-sanghvi-college/image/upload/v1735990505/m4741xh2lsw69khbeaz9.jpg" alt="images of friends" />
                        <h1 className=" text-xl ml-2">Cricket paglu</h1>
                      </div>

                    </div>
                    <div className="text-[#BED7F8] my-2">
                      <h1 className="text-xl">Freinds for you</h1>
                      <div className="flex items-center my-6 ">
                        <img className="w-8 h-8 rounded-full" src="https://res.cloudinary.com/dj-sanghvi-college/image/upload/v1735990505/m4741xh2lsw69khbeaz9.jpg" alt="images of friends" />
                        <h1 className=" text-xl ml-2">Name</h1>
                      </div>
                      <div className="flex items-center">
                        <img className="w-8 h-8 rounded-full" src="https://res.cloudinary.com/dj-sanghvi-college/image/upload/v1735990505/m4741xh2lsw69khbeaz9.jpg" alt="images of friends" />
                        <h1 className=" text-xl ml-2">Name</h1>
                      </div>
                      <div className="flex items-center my-6">
                        <img className="w-8 h-8 rounded-full" src="https://res.cloudinary.com/dj-sanghvi-college/image/upload/v1735990505/m4741xh2lsw69khbeaz9.jpg" alt="images of friends" />
                        <h1 className=" text-xl ml-2">Name</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {
                display &&
                <div className="flex flex-col items-center justify-center absolute top-12 w-screen z-50 px-2">
                  <div className={`bg-[#435280] shadow-lg  w-[99%] border-2 border-black md:w-1/2 flex flex-col items-center justify-between rounded-lg text-center text-white ${!previewSource ? "h-[340px] md:h-[540px]" : ""}`}>
                    {previewSource &&
                      <div className="flex w-full text-white mb-1">
                        <div onClick={() => { setPreviewSource(""); setFileInputState("") }}>
                          <i className="fa-solid fa-arrow-left  p-4 rounded-md fa-xl cursor-pointer"></i>
                        </div>
                      </div>
                    }
                    {
                      !previewSource &&
                      <div onClick={() => setDisplay(!display)} className="flex w-full justify-start text-white ml-3">
                        <i className="fa-solid fa-xmark text-2xl cursor-pointer"></i>
                      </div>
                    }
                    {
                      !previewSource ? <div className="flex flex-col">
                        <i className="fa-solid fa-2xl fa-photo-film cursor-pointer mb-4"></i>
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
                          style={{ display: "none" }}
                          name="file"
                          className="focus:outline-none"
                        />
                      </div> :

                        <div> {
                          !sloading ?
                            <div className="flex flex-col">
                              < img
                                className=" object-cover"
                                src={previewSource}
                                alt="write"
                              /></div> : <SpinnerCircular
                              size="90"
                              className="w-full flex items-center flex-col  mx-auto"
                              thickness="100"
                              speed="600"
                              color="white"
                              secondaryColor="black"
                            />
                        }</div>
                    }
                    <div>
                    </div>

                    {previewSource &&
                      <div className="">
                        <div onClick={handleSubmit}>
                          <h1 className=" cursor-pointer p-1 my-2 bg-white text-black rounded-md text-xl">Post</h1>
                        </div>
                      </div>}
                  </div>

                </div>
              }
            </div>
          </>
      }
    </>
  );
}

export default App;
