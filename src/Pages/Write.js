import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../utils/Navbar";
import toast from "react-hot-toast";
import { SpinnerCircular } from "spinners-react";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import Cropper from "react-easy-crop";
import { useSelector } from "react-redux";
import InputEmoji from 'react-input-emoji'

function Write({ socket }) {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const { imgUrl,imagePreview } = useSelector((state) => state.image);


  const [textAreaCount, setTextAreaCount] = useState("0/180");
  const max = 180;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };

  const recalculate = (text) => {
    const currentLength = text.length;
    console.log(currentLength);
    console.log('enter in recalculate', text)
    setTextAreaCount(`${currentLength}/${max}`);
    setCaption(text)
  };

const handleImage = async () => {
  return new Promise((resolve, reject) => {
    if (!imgUrl) return reject("No image provided");
    const reader = new FileReader();
    reader.readAsDataURL(imgUrl);
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
      { data: base64EncodedImage },
      config
    );
    setProfile(data);
    return data;
  } catch (err) {
    setLoading(false);
    console.error(err);
    toast.error("An error occurred during submission");
    throw err; 
  }
};

const handleSubmit = async (text) => {
  try {
    
    if (!imgUrl) return;
    setLoading(true);

    const base64Image = await handleImage();

    const uploadedImageData = await uploadImage(base64Image);

    const { data } = await axios.post(
      `${BASE_URL}/api/post`,
      { content: uploadedImageData, caption: text },
      config
    );

    setLoading(false);
    navigate("/home");
    localStorage.setItem("data", JSON.stringify(data));
    toast.success("Post created");
  } catch (error) {
    console.error(error);
    toast.error("An error occurred during submission");
  }
};


  return (
    <>
      <Navbar socket={socket} />
      <div className="flex pt-9 w-screen mx-auto">
        <form
          className="flex flex-col md:justify-center  md:m-auto w-screen h-[calc(100vh-2.4rem)] lg:w-[60%] md:w-[75%] md:h-[calc(100vh-2.7rem)]"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between p-4">
            <div className="flex items-center space-x-5">
              <i
                className="fa-solid fa-2xl fa-xmark cursor-pointer text-[#8aaaeb]"
                onClick={() => navigate("/")}
              ></i>
              <h1 className="font-bold  text-xl text-[#8aaaeb]">Post</h1>
            </div>
          </div>
          {
            loading ?
            <SpinnerCircular
            size="90"
            className="bg-[#2D3B58] w-full flex items-center mt-12 flex-col  mx-auto"
            thickness="100"
            speed="600"
            color="white"
            secondaryColor="black"
          />
            :
            <>
          <div className="flex flex-col justify-center items-center">
              <img
                className="h-28 md:h-64 lg:h-72 xl:h-80 object-contain"
                src={
                  imagePreview
                }
                alt="write"
              />
          </div>
          <div className="bottom">
            <div className="p-2">
              <h1 className="text-[#8aaaeb] my-4">Caption</h1>
              <div className="flex items-center bg-[#455175] mb-1 lg:mb-2 rounded-md w-full">
              <div
        className="w-[80%] max-w-sm sm:max-w-md lg:max-w-lg"

      >
        <InputEmoji
                  value={caption}
                  onChange={recalculate}
                  cleanOnEnter
                  onEnter={handleSubmit}
                  maxLength={max}
          placeholder="Write a caption..."
        />
      </div>
                  <p className="w-[20%] md:text-center">{textAreaCount}</p>
                </div>
            </div>
          </div>
            </>
          }
        </form>
      </div>
    </>
  );
}

export default Write;
