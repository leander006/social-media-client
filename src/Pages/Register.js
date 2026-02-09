import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import FormInput from "../utils/FormInput";
import ButtonInput from "../utils/ButtonInput";
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        username,
        password,
        name,
        email,
      });
      toast.success("An email send for verification");
      setName("");
      setPassword("");
      setEmail("");
      setUsername("");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const google = (e) => {
    e.preventDefault();
    window.open(`${BASE_URL}/api/auth/google/callback`, "_self");
  };
  return (
    <>
      <div className="min-h-screen w-full overflow-x-hidden px-4 flex items-center justify-center">
        <div className="w-full max-w-7xl flex">
          <div className="flex items-center justify-center flex-1 lg:flex-[0.8] p-4 lg:p-10">
            <div className="flex w-full max-w-[360px] md:max-w-[420px] xl:max-w-[480px] 2xl:max-w-[520px] bg-white rounded-lg">
              <div className="flex flex-col w-full p-4">
                <h1 className="text-black text-xl md:mb-3">CREATE ACCOUNT</h1>
                <h3 className="text-slate-600 mt-2">
                  Join the virtual social network
                </h3>
                <form className="flex flex-col " onSubmit={handleSubmit}>
                  <FormInput name="Name" onChange={(e) => setName(e.target.value)} required={true} />
                  <FormInput name="Email" onChange={(e) => setEmail(e.target.value)} required={true} />
                  <FormInput name="Username" onChange={(e) => setUsername(e.target.value)} required={true} />
                  <FormInput name="Password" onChange={(e) => setPassword(e.target.value)} required={true} />

                  <div className="w-full md:flex md:space-x-2 flex-col md:flex-row">
                    <ButtonInput value="Create New Account" />
                    <ButtonInput onClick={() => navigate("/login")} value="Login" />
                  </div>
                </form>
                <h1 className="text-center my-2 text-slate-500">
                  --------or--------
                </h1>
                <div className=" bg-[#2D3B58] text-white flex rounded-lg hover:bg-[#212e49] hover:border ">
                  <i className="fa-brands text-[#b4c1db] fa-2xl fa-google-plus-g m-auto pl-2"></i>
                  <button className=" w-full h-10" onClick={google}>
                    Sign in with google
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center flex-[1.2]">
            <img className="w-full max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] h-auto object-contain" src="/images/register.jpeg" alt="register"></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
