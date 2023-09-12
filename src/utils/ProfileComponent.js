import React from "react";

function ProfileComponent({ currentUser }) {
  return (
    <div className="flex flex-col space-y-12 items-center justify-center mx-auto w-full h-fit p-2">
      <div className="lg:w-3/4 md:w-[240px] p-2 text-white bg-[#38487a] rounded-lg ">
        <div className="flex flex-col mb-2 items-center border border-x-0 border-t-0">
          <img
            className="w-16 h-16 rounded-full"
            src={currentUser?.profile?.url}
            alt={currentUser?.username}
          />
          <div className="font-bold">{currentUser?.username}</div>
          <div className=" mb-2">{currentUser?.bio}</div>
        </div>
        <div className="flex flex-col items-center border border-x-0 border-t-0">
          <div>Followers : {currentUser?.followers.length}</div>
          <div className="mb-2">
            Following : {currentUser?.following.length}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="mt-2">PostCount: {currentUser?.postCount}</div>
          <div>Status: {currentUser?.status}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
