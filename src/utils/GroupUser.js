import React from "react";

function GroupUser({ user, handleFunction }) {
  return (
    <div
      className="flex bg-[#3e8df3] items-center p-2 cursor-pointer "
      onClick={handleFunction}
    >
      <img
        src={user.profile?.url}
        className="rounded-full h-10 w-10"
        alt="groupUser"
      />
      <div className="flex mb-2 ml-2">
        <div className="h-3">{user.username}</div>
      </div>
    </div>
  );
}

export default GroupUser;
