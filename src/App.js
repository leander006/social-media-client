import Explore from "./Pages/Explore";

import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import axios from "axios";
import LikedPost from "./Pages/LikedPost";
import SavedPost from "./Pages/SavedPost";
import Profile from "./Pages/Profile";

import Chat from "./Pages/Chat";
import Write from "./Pages/Write";
import Edit from "./Pages/Edit";
import EmailVerificatiion from "./Pages/EmailVerificatiion";
import SinglePage from "./Pages/SinglePage";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { BASE_URL } from "./services/helper";
axios.defaults.withCredentials = true;
const Endpoint = `${BASE_URL}/`;
function App() {
  const { currentUser } = useSelector((state) => state.user);
  const socket = io(Endpoint);

  return (
    <>
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
          element={currentUser ? <Profile socket={socket} /> : <Login />}
        />
        <Route
          path="/savedPost"
          element={currentUser ? <SavedPost socket={socket} /> : <Login />}
        />
        <Route
          path="/chat"
          element={currentUser ? <Chat socket={socket} /> : <Login />}
        />
        <Route
          path="/explore"
          element={currentUser ? <Explore socket={socket} /> : <Login />}
        />
        <Route
          path="/write"
          element={currentUser ? <Write socket={socket} /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/edit/:editId"
          element={currentUser ? <Edit socket={socket} /> : <Login />}
        />
        <Route
          path="/singlepage/:postId"
          element={currentUser ? <SinglePage socket={socket} /> : <Login />}
        />
        <Route
          path="/users/:id/verify/:token"
          element={currentUser ? <EmailVerificatiion /> : <Login />}
        />
      </Routes>
    </>
  );
}

export default App;
