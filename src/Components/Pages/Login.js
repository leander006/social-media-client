import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loginError,
  loginStart,
  loginSuccess,
} from "../../redux/Slice/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        }
      );
      dispatch(loginSuccess(data));
      navigate("/home");
    } catch (err) {
      dispatch(loginError());
      console.log(err?.response?.data?.message);
      toast.error("Something went wrong login through google account");
    }
  };
  const google = (e) => {
    e.preventDefault();
    const data = window.open("http://localhost:3001/auth/google", "_self");
  };
  return (
    <>
      <div className="flex justify-evenly h-screen w-screen md:bg-[#2D3B58]">
        <div className="hidden md:flex m-auto flex-1">
          <img src="/images/login.jpeg" alt="login"></img>
        </div>
        <div className="flex flex-1 justify-center items-center ">
          <div className="flex w-screen  bg-white rounded-lg lg:w-[400px]  md:w-[300px] md:justify-center">
            <div className="flex flex-col w-full p-5">
              <h1 className="text-black text-xl md:mb-3">Login</h1>
              <form
                className="flex justify-center flex-col item-center mt-4"
                onSubmit={handleSubmit}
              >
                <label className="mb-2">Username</label>
                <input
                  className="w-full mb-3 h-12 rounded-md p-3 md:mb-8  border border-black"
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  required
                />
                <label className="mb-2">Password</label>
                <input
                  className="w-full h-12 mb-4 rounded-md p-3 md:mb-8  border border-black"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
                <div className="md:flex md:justify-evenly">
                  <input
                    type="submit"
                    className="bg-[#BED7F8] mb-2 cursor-pointer w-full md:w-32 h-10 md:mr-2 hover:bg-[#afd1fd]"
                    value="login"
                  />
                  <Link to="/register">
                    <button className="bg-[#BED7F8] w-full h-10 md:w-32 hover:bg-[#afd0fa]">
                      Sign up
                    </button>
                  </Link>
                </div>
              </form>
              <h1 className="text-center my-2 text-slate-500">
                --------or--------
              </h1>
              <div className=" bg-[#2D3B58] text-white flex rounded-lg hover:bg-[#212e49] hover:border ">
                <i className="fa-brands text-[#b4c1db] fa-2xl fa-google-plus-g m-auto pl-2"></i>
                <button className=" w-full h-10" onClick={google}>
                  Login with google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
