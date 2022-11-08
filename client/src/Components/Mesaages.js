import React, { useState } from "react";
import { useSelector } from "react-redux";
// import { format } from "timeago.js";
function Mesaages({ messages, own, handleFunction }) {
  const { currentUser } = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);
  return (
    <div className={own ? "flex justify-end" : "flex justify-start"}>
      <div className="flex flex-col mt-2 w-fit">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mt-2 mb-2 mr-3 ml-3 border border-navbar"
            src={messages?.sender?.profile}
            alt="message"
          />
          <h1 className="text-[#2D3B58]">{messages?.sender?.username}</h1>
          {/* <p className="text-slate-900 ml-2 ">{format(messages?.createdAt)}</p> */}
        </div>
        <div
          className="flex"
          onMouseEnter={() => {
            setVisible(true);
          }}
          onMouseLeave={() => {
            setVisible(false);
          }}
        >
          <p className="pl-2 text-[#2D3B58]">{messages?.content}</p>
          {visible && (
            <div className="">
              <i
                className={
                  messages?.sender?._id === currentUser._id
                    ? "fa-solid fa-xl ml-2 fa-trash-can cursor-pointer"
                    : ""
                }
                onClick={handleFunction}
              ></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mesaages;
