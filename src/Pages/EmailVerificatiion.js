import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../services/helper";

function EmailVerificatiion() {
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        await axios.get(
          `${BASE_URL}/api/user/${param.id}/verify/${param.token}`
        );
        setValidUrl(true);
      } catch (error) {
        console.log(error.message);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <div className="main">
      {validUrl ? (
        <div className="flex h-screen w-screen pt-28 items-center flex-col">
          <img
            className="w-fit md:w-72"
            src="/images/success.png"
            alt="success_img"
          />
          <h1 className="text-[#5fd679] my-6">Email verified successfully</h1>
          <div className="bg-green-700 text-white p-2 rounded-lg">
            <Link to="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          </div>
        </div>
      ) : (
        <Link to="/register">
          <div className="flex h-screen w-screen cursor-pointer justify-center items-center">
            <h1 className=" text-2xl  md:text-[4rem] lg:text-[5rem] font-bold text-[#ff1a1a]">
              404 Not Found
            </h1>
          </div>
        </Link>
      )}
    </div>
  );
}

export default EmailVerificatiion;
