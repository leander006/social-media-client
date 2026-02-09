
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginError, loginStart, loginSuccess } from "../redux/Slice/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import FormInput from "../utils/FormInput";
import ButtonInput from "../utils/ButtonInput";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      await axios.post(
        `${BASE_URL}/api/auth/login`,
        { username, password }
      );
      const { data } = await axios.get(
        `${BASE_URL}/api/user/me`,
        { withCredentials: true }
      );
      dispatch(loginSuccess(data));
      navigate("/home");
    } catch (err) {
      dispatch(loginError());
      toast.error(
        err?.response?.data?.message || "Login failed"
      );
    }
  };


  const google = (e) => {
    e.preventDefault();
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <>
      <div className="min-h-screen w-full overflow-x-hidden px-4 flex items-center justify-center">
        <div className="w-full max-w-7xl flex">
          <div className="hidden lg:flex items-center justify-center flex-[1.2]">
            <img className="w-full max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] h-auto object-contain" src="/images/login.jpeg" alt="login"></img>
          </div>
          <div className="flex items-center justify-center flex-1 lg:flex-[0.8] ">
            <div className="flex w-full max-w-[360px] md:max-w-[420px] xl:max-w-[480px] 2xl:max-w-[520px] bg-white rounded-lg">
              <div className="flex flex-col w-full p-5 xl:p-6 2xl:p-8">
                <h1 className="text-black text-xl xl:text-2xl 2xl:text-3xl mb-3">Login</h1>
                <form
                  className="flex justify-center flex-col item-center mt-4"
                  onSubmit={handleSubmit}
                >
                  <FormInput name="Username" onChange={(e) => setUsername(e.target.value)} required={true} />
                  <FormInput name="Password" onChange={(e) => setPassword(e.target.value)} required={true} />

                  <div className="w-full md:flex md:space-x-2 flex-col md:flex-row">
                    <ButtonInput value="Login" />
                    <ButtonInput onClick={() => navigate("/register")} value=" Create New Account" />
                  </div>
                </form>
                <h1 className="text-center my-2 text-slate-500">
                  --------or--------
                </h1>
                <div className=" bg-[#2D3B58] text-white flex rounded-lg hover:bg-[#212e49] hover:border ">
                  <i className="fa-brands text-[#b4c1db] fa-2xl fa-google-plus-g m-auto pl-2"></i>
                  <button type="button" className=" w-full h-10" onClick={google}>
                    Login with google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
