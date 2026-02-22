import React from "react";
import { useSelector } from "react-redux";
// import { format } from "timeago.js";
function Mesaages({ messages, own, handleFunction }) {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className={own ? "flex justify-end " : "flex justify-start"}>
      <div className="flex flex-col mt-2 w-fit">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mt-2 mb-2 mr-3 border border-navbar"
            src={messages?.sender?.profile?.url}
            alt="message"
          />
          <h1 className="text-[#2D3B58]">{messages?.sender?.username}</h1>
        </div>
        <div className="flex relative ml-0.5">
          <p className={messages?.sender?._id === currentUser._id ? "pl-2 text-[#2D3B58] w-44 break-words" : "pl-2 text-[#2D3B58]"}>{messages?.content}</p>
          <div className="group">
            {own && <i className="fa-solid fa-ellipsis-vertical cursor-pointer ml-3"></i>}
            <div className=" absolute hidden group-hover:block right-0 bg-[#2f3549] text-white p-2 -top-10 cursor-pointer" onClick={handleFunction}>Delete</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mesaages;
