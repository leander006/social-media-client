import Explore from "./Components/Pages/Explore";

import Home from "./Components/Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import axios from "axios";
import LikedPost from "./Components/Pages/LikedPost";
import SavedPost from "./Components/Pages/SavedPost";
import Profile from "./Components/Pages/Profile";

import Chat from "./Components/Pages/Chat";
import Write from "./Components/Pages/Write";
import Edit from "./Components/Pages/Edit";
import EmailVerificatiion from "./Components/Pages/EmailVerificatiion";
import SinglePage from "./Components/Pages/SinglePage";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={currentUser ? <Home /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={currentUser ? <Home /> : <Login />} />
          <Route path="/like" element={<LikedPost />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/savedPost" element={<SavedPost />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/write" element={<Write />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit/:editId" element={<Edit />} />
          <Route path="/singlepage/:postId" element={<SinglePage />} />
          <Route
            path="/users/:id/verify/:token"
            element={<EmailVerificatiion />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
