import React from "react";

function Conversation({ chat, name, img }) {
  return (
    <div className="flex md:h-12 border justify-between m-2 rounded-md bg-white cursor-pointer">
      <div className="flex justify-end">
        <div>
          <img
            className="w-10 h-10 md:w-7 md:h-7 rounded-full mt-2 mb-2 mr-3 ml-3 border border-main"
            src={img}
            alt="iconversation"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="capitalize text-slate-600">{name}</h1>

          <div className="flex flex-col">
            <h1 className="hidden lg:flex capitalize text-primary">
              {chat?.latestMessage?.content?.length > 14
                ? chat?.latestMessage?.content.substring(0, 14) + "..."
                : chat?.latestMessage?.content}
            </h1>
            <h1 className=" flex lg:hidden capitalize text-primary">
              {chat?.latestMessage?.content?.length > 25
                ? chat?.latestMessage?.content.substring(0, 25) + "..."
                : chat?.latestMessage?.content}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
