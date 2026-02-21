import React, { useState } from "react";
import { useSelector } from "react-redux";
// import { format } from "timeago.js";
function Mesaages({ messages, own, handleFunction }) {
  const { currentUser } = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);
  return (
    <div onClick={() => visible === true && setVisible(!visible)} className={own ? "flex justify-end " : "flex justify-start"}>
      <div className="flex flex-col mt-2 w-fit">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mt-2 mb-2 mr-3 border border-navbar"
            src={messages?.sender?.profile?.url}
            alt="message"
          />
          <h1 className="text-[#2D3B58]">{messages?.sender?.username}</h1>
          {/* <p className="text-slate-900 ml-2 ">{format(messages?.createdAt)}</p> */}
        </div>
        <div className="flex relative ml-0.5">
          <p className={messages?.sender?._id === currentUser._id ? "pl-2 text-[#2D3B58] cursor-pointer w-44 break-words" : "pl-2 text-[#2D3B58]"}>{messages?.content}</p>
          {/* <p className={messages?.sender?._id !== currentUser._id?"pl-2 text-[#2D3B58] cursor-pointer w-44 break-words":"pl-2 text-[#2D3B58]"}>{messages?.content}</p> */}
          {own && <i onClick={() => setVisible(!visible)} className="fa-solid fa-ellipsis-vertical cursor-pointer ml-3"></i>}
          {visible && <div className=" absolute right-0 bg-[#2f3549] text-white p-2 bottom-6 cursor-pointer" onClick={handleFunction}>Delete</div>}
        </div>
      </div>
    </div>
  );
}

export default Mesaages;
