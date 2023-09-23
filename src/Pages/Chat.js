import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Conversation from "../utils/Conversation";
import Navbar from "../utils/Navbar";
import Messages from "../utils/Mesaages";
import NopPreview from "../utils/NopPreview";
import { BASE_URL } from "../services/helper";
import DirectMessage from "../utils/DirectMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  chatError,
  chatStart,
  chatSuccess,
  setCurrentChat,
} from "../redux/Slice/chatSlice";
import {
  messageError,
  messageStart,
  messageSuccess,
} from "../redux/Slice/messageSlice";
import toast from "react-hot-toast";
import ConversationSkeleton from "../Skeleton/ConversationSkeleton";
import GroupUser from "../utils/GroupUser";
import ListItems from "../utils/ListItems";
import { SpinnerCircular } from "spinners-react";
import axios from "axios";

var selectedChatCompare;

function Chat({ socket }) {
  const scrollRef = useRef();
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState([]);
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [addUser, setAddUser] = useState([]);
  const [name, setName] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  const [addUserGroup, setAdddUserGroup] = useState(false);
  const { allChat, currentChat } = useSelector((state) => state.chat);
  const { allmessage } = useSelector((state) => state.message);
  const [loading, setLoading] = useState(false);
  const { currentUser, chatloading } = useSelector((state) => state.user);
  const { allNoti } = useSelector((state) => state.notification);
  const [chatname, setChatname] = useState("");
  const user = currentUser?.others ? currentUser?.others : currentUser;
  const dispatch = useDispatch();
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage?.getItem("token")}`,
    },
  };
  // Socket //
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  const typingHandler = (e) => {
    setMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timenow = new Date().getTime();
      var timeDiff = timenow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", currentChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //-------//

  useEffect(() => {
    const getChat = async () => {
      try {
        dispatch(chatStart());
        const { data } = await axios.get(`${BASE_URL}/api/chat`, config);
        dispatch(chatSuccess(data));
      } catch (error) {
        dispatch(chatError());
        console.log(error?.response?.data);
      }
    };
    getChat();
    // eslint-disable-next-line
  }, [user, allNoti, allmessage]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        setLoading(true);
        dispatch(messageStart());
        const { data } = await axios.get(
          `${BASE_URL}/api/message/get/` + currentChat._id,
          config
        );
        dispatch(messageSuccess(data));
        socket.emit("join room", currentChat._id);
        setLoading(false);
      } catch (error) {
        dispatch(messageError());
        console.log(error?.response?.data);
      }
    };
    getMessage();
    selectedChatCompare = currentChat;
    // eslint-disable-next-line
  }, [currentChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    socket.emit("stop typing", currentChat._id);
    try {
      dispatch(messageStart());
      const { data } = await axios.post(
        `${BASE_URL}/api/message/` + currentChat._id,
        { content: message },
        config
      );
      socket.emit("send_message", data);
      // socket.emit("sendNotification", {
      //   senderName: user,
      //   receiverName: post.username,
      //   type,
      // });
      dispatch(messageSuccess([...allmessage, data]));
      setMessage("");
    } catch (error) {
      dispatch(messageError());
      console.log(error?.response?.data);
    }
  };

  const handleDelete = async (me) => {
    try {
      dispatch(messageStart());
      await axios.delete(`${BASE_URL}/api/message/delete/${me._id}`, config);
      dispatch(messageSuccess(allmessage.filter((m) => m._id !== me._id)));
      socket.emit("new message delete", me);
      setMessage(" ");
    } catch (error) {
      dispatch(messageError);
      console.log(error?.response?.data);
    }
  };

  useEffect(() => {
    socket.on("message recieved", async (newMessage) => {
      dispatch(messageSuccess([...allmessage, newMessage]));
    });
  });

  useEffect(() => {
    socket.on("message deleted", (newMessage) => {
      dispatch(
        messageSuccess(allmessage.filter((m) => m._id !== newMessage._id))
      );
    });
  });

  const groupDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(chatStart());
      await axios.delete(
        `${BASE_URL}/api/chat/delete/` + currentChat._id,
        config
      );
      dispatch(chatSuccess(allChat.filter((c) => c._id !== currentChat._id)));
      dispatch(setCurrentChat(""));
    } catch (error) {
      dispatch(chatError());
    }
  };
  const handleGroupChat = (e) => {
    e.preventDefault();
    setSearchResult(!searchResult);
  };
  const addGroup = (e) => {
    e.preventDefault();
    setAdddUserGroup(!addUserGroup);
  };

  const handleSearch = async (query) => {
    setGroupSearch(query);
    if (!query) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/user/freind/search?name=` + groupSearch,
        config
      );
      setAddUser(data);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
  const handleSearched = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/user/freind/search?name=` + search,
        config
      );
      setSearched(data);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleGroup = (addUser) => {
    if (selectedUser.includes(addUser)) {
      return;
    }
    setSelectedUser([...selectedUser, addUser]);
  };

  const handleCancel = (deleteUser) => {
    setSelectedUser(selectedUser.filter((s) => s._id !== deleteUser._id));
  };

  const handleRemove = async (deleteUser) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/remove/` + currentChat._id,
        { userId: deleteUser._id },
        config
      );
      dispatch(setCurrentChat(data));
      toast.success("Removed user");
    } catch (error) {
      console.log(error);
    }
  };

  const exit = async (removeUser) => {
    try {
      dispatch(chatStart());
      await axios.put(
        `${BASE_URL}/api/chat/remove/` + currentChat._id,
        { userId: removeUser._id },
        config
      );
      dispatch(chatSuccess(allChat.filter((c) => c._id !== currentChat._id)));
      dispatch(setCurrentChat(""));
      toast.success("Left group");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (addUser) => {
    const Users = currentChat?.users?.map((u) => u._id);
    try {
      if (Users.includes(addUser._id)) {
        toast.error("Already included in grp ");
        return;
      } else {
        const { data } = await axios.put(
          `${BASE_URL}/api/chat/add/` + currentChat._id,
          { userId: addUser._id },
          config
        );
        dispatch(setCurrentChat(data));
        toast.success("New member added in group");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/rename/` + currentChat._id,
        { chatname: chatname },
        config
      );
      dispatch(setCurrentChat(data));
      toast.success("Renamed the group");
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      dispatch(chatStart());
      const { data } = await axios.post(
        `${BASE_URL}/api/chat`,
        { name: name, users: JSON.stringify(selectedUser.map((u) => u._id)) },
        config
      );

      dispatch(chatSuccess([data, ...allChat]));
      setCurrentChat(data);
      setSearchResult(!searchResult);
      toast.success("Group created");
    } catch (error) {
      console.log(error);
      dispatch(chatError());
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat, message]);

  return (
    <>
      <Navbar socket={socket} />
      <div className="flex mt-10">
        {/* Destop view  */}
        <div className="hidden md:flex w-screen ">
          <div className="conversation w-[40%] border border-y-0">
            <div className="flex justify-between items-center p-3">
              <div className="flex bg-[#455175] w-full h-8 mt-1 items-center rounded-md">
                <input
                  className="rounded-md focus:outline-[#BED7F8] w-full h-full p-1"
                  value={search}
                  type="text"
                  onChange={(e) => handleSearched(e.target.value)}
                  placeholder="search your friends"
                ></input>
                <div className="shadow hidden md:flex mt-24 fixed z-30 ">
                  <div className="md:w-64 lg:w-80 xl:w-[30rem]  ">
                    {searched?.map((s) => (
                      <DirectMessage
                        key={s._id}
                        setSearched={setSearched}
                        setSearch={setSearch}
                        search={s}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <i
                  className="fa-solid fa-xl fa-user-plus ml-4 text-[#BED7F8] cursor-pointer"
                  onClick={handleGroupChat}
                ></i>
              </div>
            </div>
            {/* {search && <ChatSearchSkeleton/>} */}
            <div className="md:h-[calc(100vh-6.7rem)] p-3 overflow-y-scroll">
              {allChat ? (
                !chatloading ? (
                  allChat?.map((c) => (
                    <div
                      className="individual-chat"
                      key={c?._id}
                      onClick={() => {
                        dispatch(setCurrentChat(c));
                      }}
                    >
                      <Conversation
                        img={
                          c?.isGroupChat
                            ? "images/noProfile.jpeg"
                            : user._id === c?.users[0]?._id
                            ? c?.users[1]?.profile?.url
                            : c?.users[0]?.profile?.url
                        }
                        name={
                          c?.isGroupChat
                            ? c?.chatname
                            : user._id === c?.users[0]?._id
                            ? c?.users[1]?.username
                            : c?.users[0]?.username
                        }
                        chat={c}
                        key={c?._id}
                      />
                    </div>
                  ))
                ) : (
                  allChat?.map((c) => (
                    <div key={c._id}>
                      <ConversationSkeleton key={c._id} />
                    </div>
                  ))
                )
              ) : (
                <div className="flex justify-center font-bold text-gray-400 text-xl">
                  No conversation
                </div>
              )}
            </div>
          </div>

          {currentChat ? (
            <div className="message w-[60%]">
              <div className="flex justify-between items-center message  md:bg-[#84b6f7]">
                <div className="flex h-12 items-center p-3">
                  <img
                    src={
                      currentChat?.isGroupChat
                        ? "images/noProfile.jpeg"
                        : user._id === currentChat?.users[0]?._id
                        ? currentChat?.users[1]?.profile?.url
                        : currentChat?.users[0]?.profile?.url
                    }
                    alt="chat"
                    className="w-10 h-10  rounded-full border"
                  />
                  <div className="flex flex-col">
                    <h1 className="capitalize text-black ml-4 font-sans ">
                      {currentChat?.isGroupChat
                        ? currentChat?.chatname
                        : user._id === currentChat?.users[0]?._id
                        ? currentChat?.users[1]?.username
                        : currentChat?.users[0]?.username}
                    </h1>
                    {isTyping ? (
                      <div className="flex flex-wrap ml-4">
                        {currentChat?.isGroupChat
                          ? "Someone "
                          : user._id === currentChat?.users[0]?._id
                          ? currentChat?.users[1]?.username
                          : currentChat?.users[0]?.username}{" "}
                        is typing..
                      </div>
                    ) : (
                      <div className="flex flex-wrap ml-4"></div>
                    )}
                  </div>
                </div>
                <div className="flex">
                  {!currentChat?.isGroupChat &&
                    currentChat.users.filter((c) => c._id === user)?.length ===
                      1 && (
                      <div>
                        <i
                          className="fa-solid fa-xl mr-2 fa-trash cursor-pointer"
                          onClick={groupDelete}
                        ></i>
                      </div>
                    )}
                  {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id !== user && (
                      <div>
                        <i
                          className="fa-solid fa-xl mr-2 fa-delete-left cursor-pointer"
                          onClick={() => exit(user)}
                        ></i>
                      </div>
                    )}

                  {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id === user && (
                      <div>
                        <i
                          className="fa-solid fa-xl mr-2 fa-trash cursor-pointer"
                          onClick={groupDelete}
                        ></i>
                      </div>
                    )}
                  {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id === user && (
                      <div>
                        <i
                          className="fa-solid fa-xl fa-user-plus mr-4 text-black cursor-pointer"
                          onClick={addGroup}
                        ></i>
                      </div>
                    )}
                </div>
              </div>

              {!loading ? (
                <div className="md:h-[calc(100vh-10.2rem)] md:bg-[#BED7F8] p-3 overflow-y-scroll">
                  {allmessage?.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <Messages
                        own={m?.sender?._id === user?._id}
                        handleFunction={() => handleDelete(m)}
                        messages={m}
                        setMessage={setMessage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <SpinnerCircular
                  size="90"
                  className="bg-[#2D3B58] w-full flex items-center md:h-[calc(100vh-10.2rem)] flex-col  mx-auto"
                  thickness="100"
                  speed="600"
                  color="white"
                  secondaryColor="black"
                />
              )}

              <form className="flex bg-[#BED7F8] h-12 items-center p-2 m-3 mt-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Enter message"
                  value={message}
                  onChange={typingHandler}
                  className="w-full h-10 rounded-lg p-5 border"
                  required
                />
                <button>
                  <i
                    className="fa-solid fa-paper-plane fa-xl p-2 cursor-pointer hover:text-slate-400"
                    onClick={sendMessage}
                  ></i>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex m-auto items-center">
              <NopPreview />
            </div>
          )}
        </div>
        {/* -------- */}

        {/* Mobile view */}

        <div className="flex md:hidden z-10 flex-col md:p-0 w-screen h-[calc(100vh-2.5rem)]">
          {!currentChat ? (
            <div className="conversation lg:flex-1">
              <div className="flex justify-between items-center md:p-3">
                <div className="flex bg-[#455175] mx-2 w-full h-8 mt-2 items-center rounded-md">
                  <input
                    className="rounded-md focus:outline-[#BED7F8] w-full h-full p-1"
                    value={search}
                    type="text"
                    onChange={(e) => handleSearched(e.target.value)}
                    placeholder="search your friends"
                  />
                </div>

                <div className="flex mt-36 fixed z-30 ">
                  <div className=" w-[92vw] p-2 ">
                    {searched?.map((s) => (
                      <DirectMessage
                        key={s._id}
                        setSearched={setSearched}
                        setSearch={setSearch}
                        search={s}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-[calc(100vh-8rem)] p-1 overflow-y-scroll">
                {allChat ? (
                  !chatloading ? (
                    allChat?.map((c) => (
                      <div
                        className="individual-chat"
                        key={c?._id}
                        onClick={() => {
                          dispatch(setCurrentChat(c));
                        }}
                      >
                        <Conversation
                          img={
                            c?.isGroupChat
                              ? "images/noProfile.jpeg"
                              : user?._id === c?.users[0]._id
                              ? c?.users[1]?.profile?.url
                              : c?.users[0]?.profile?.url
                          }
                          name={
                            c?.isGroupChat
                              ? c?.chatname
                              : user?._id === c?.users[0]?._id
                              ? c?.users[1]?.username
                              : c?.users[0]?.username
                          }
                          chat={c}
                          key={c?._id}
                        />
                      </div>
                    ))
                  ) : (
                    allChat?.map((c) => (
                      <div key={c._id} className="">
                        <ConversationSkeleton key={c._id} />
                      </div>
                    ))
                  )
                ) : (
                  <div className="flex justify-center font-bold text-gray-400 text-xl">
                    No conversation
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="message">
              <div className="flex justify-between items-center message bg-[#8cbeff] md:hidden">
                <div className="flex h-12 items-center p-3">
                  <i
                    className="fa-solid mr-2 fa-xl cursor-pointer fa-arrow-left"
                    onClick={() => {
                      dispatch(setCurrentChat(!currentChat));
                    }}
                  ></i>
                  <Link to="/profile">
                    <img
                      src={
                        currentChat?.isGroupChat
                          ? "images/noProfile.jpeg"
                          : currentChat?.users[0]?._id === user?._id
                          ? currentChat?.users[1]?.profile?.url
                          : currentChat?.users[0]?.profile?.url
                      }
                      alt="chat"
                      className="w-10 h-10 rounded-full cursor-pointer border"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <h1 className="capitalize text-black ml-4 font-sans ">
                      {currentChat?.isGroupChat
                        ? currentChat?.chatname
                        : user?._id === currentChat?.users[0]?._id
                        ? currentChat?.users[1]?.username
                        : currentChat?.users[0]?.username}
                    </h1>
                    {isTyping ? (
                      <div className="flex flex-wrap ml-4">
                        {currentChat?.isGroupChat
                          ? "Someone "
                          : user?._id === currentChat?.users[0]?._id
                          ? currentChat?.users[1]?.username
                          : currentChat?.users[0]?.username}{" "}
                        is typing..
                      </div>
                    ) : (
                      <div className="flex flex-wrap ml-4"></div>
                    )}
                  </div>
                </div>

                <div className="flex">
                  {!currentChat?.isGroupChat &&
                    currentChat.users.filter((c) => c._id === user)?.length ===
                      1 && (
                      <div>
                        <i
                          className="fa-solid fa-xl mr-2 fa-trash cursor-pointer"
                          onClick={groupDelete}
                        ></i>
                      </div>
                    )}
                  {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id !== user?._id && (
                      <div>
                        <i
                          className="fa-solid fa-xl mr-2 fa-delete-left cursor-pointer"
                          onClick={() => exit(user)}
                        ></i>
                      </div>
                    )}
                  {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id === user?._id && (
                      <div>
                        <i
                          className="fa-solid fa-xl mr-2 fa-trash cursor-pointer"
                          onClick={groupDelete}
                        ></i>
                      </div>
                    )}
                  {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id === user?._id && (
                      <div>
                        <i
                          className="fa-solid fa-xl fa-user-plus mr-4 text-black cursor-pointer"
                          onClick={addGroup}
                        ></i>
                      </div>
                    )}
                </div>
              </div>
              {!loading ? (
                <div className="h-[calc(100vh-10rem)] bg-[#BED7F8]  p-3 overflow-y-scroll">
                  {allmessage?.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <Messages
                        own={m?.sender?._id === user?._id}
                        messages={m}
                        handleFunction={() => handleDelete(m)}
                        setMessage={setMessage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <SpinnerCircular
                  size="90"
                  className="bg-[#2D3B58] w-full flex items-center h-[calc(100vh-10.2rem)] flex-col  mx-auto"
                  thickness="100"
                  speed="600"
                  color="white"
                  secondaryColor="black"
                />
              )}
              <form className="flex bg-[#BED7F8] h-12 items-center p-2 m-3 mt-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Enter message"
                  value={message}
                  onChange={typingHandler}
                  className="w-full h-full rounded-lg p-5 border"
                  required
                />
                <button>
                  <i
                    className="fa-solid fa-paper-plane fa-xl p-2 cursor-pointer hover:text-slate-400"
                    onClick={sendMessage}
                  ></i>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ---------- */}
      </div>

      {searchResult && (
        <div className="fixed flex z-40 top-0 mt-24  w-screen lg:w-[32rem] xl:w-[36rem] xl:ml-96 md:w-96 md:ml-52 lg:ml-72">
          <form
            className="bg-[#1f62b9] h-full  m-auto w-11/12 "
            onSubmit={create}
          >
            <h1 className="text-2xl font-bold text-[#153f75] text-center">
              Create group chat
            </h1>
            <div className="h-14 w-full p-1 mt-2 ">
              <input
                className="focus:outline-slate-900 w-full h-full p-1"
                type="text"
                placeholder="Enter group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="h-14 w-full p-1 ">
              <input
                className="focus:outline-slate-900 w-full h-full p-1"
                type="text"
                placeholder="Add user eg leander06"
                value={groupSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="w-full ">
              <div className="flex flex-wrap">
                {selectedUser?.map((s) => (
                  <ListItems
                    user={s}
                    key={s._id}
                    handleFunction={() => handleCancel(s)}
                  />
                ))}
              </div>
            </div>
            <div className="w-full p-1.5">
              {addUser?.slice(0, 6).map((a) => (
                <GroupUser
                  user={a}
                  key={a._id}
                  handleFunction={() => handleGroup(a)}
                />
              ))}
            </div>
            <div className=" flex justify-around mb-2  ml-2 rounded p-1">
              <input
                className="bg-blue-500 text-white p-1 rounded text-center"
                value="Create chat"
                type="submit"
              />
              <input
                className="bg-blue-500 text-white p-1 rounded text-center"
                onClick={handleGroupChat}
                value="Cancel"
                type="button"
              />
            </div>
          </form>
        </div>
      )}
      {addUserGroup && (
        <div className="fixed flex z-40 top-0 mt-24  w-screen lg:w-[32rem] xl:w-[36rem] xl:ml-96 md:w-96 md:ml-52 lg:ml-72">
          <div className="bg-[#1f62b9]  h-full  m-auto w-11/12 ">
            <h1 className="text-2xl font-bold text-[#153f75] text-center">
              Update group
            </h1>
            <form className="h-14 flex w-full p-1 " onSubmit={handleRename}>
              <input
                className="focus:outline-slate-900 m-0.5 w-full h-full p-1"
                type="text"
                placeholder={currentChat.chatname}
                value={chatname}
                onChange={(e) => setChatname(e.target.value)}
                required
              />
              <input
                value="Rename"
                type="submit"
                className="bg-[#4c92ee] rounded m-1"
              />
            </form>

            <h1 className="text-center my-0.5 text-white">Group member</h1>
            <div className="w-full ">
              <div className="flex flex-wrap">
                {currentChat.users?.map((s) => (
                  <ListItems
                    user={s}
                    key={s._id}
                    handleFunction={() => handleRemove(s)}
                  />
                ))}
              </div>
            </div>
            <div className="h-14 w-full p-1 ">
              <input
                className="focus:outline-slate-900 w-full h-full p-1"
                type="text"
                placeholder="Add user eg leander06"
                value={groupSearch}
                onChange={(e) => handleSearch(e.target.value)}
                required
              />
            </div>
            <div className="w-full ">
              <div className="flex flex-wrap">
                {selectedUser?.map((s) => (
                  <ListItems
                    user={s}
                    key={s._id}
                    handleFunction={() => handleCancel(s)}
                  />
                ))}
              </div>
            </div>
            <div className="w-full p-1.5">
              {addUser?.slice(0, 6).map((a) => (
                <GroupUser
                  user={a}
                  key={a._id}
                  handleFunction={() => handleAdd(a)}
                />
              ))}
            </div>
            <div className="bg-blue-500 mb-2 w-fit ml-2 rounded p-1">
              <input
                className="text-center"
                onClick={addGroup}
                value="Cancel"
                type="button"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Chat;
