import React, { useEffect, useRef, useState } from "react";
import { Link, } from "react-router-dom";
import Conversation from "../utils/Conversation";
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
import InputEmoji from 'react-input-emoji'
import { getSocket } from "../redux/Slice/socketSlice";

function Chat() {
  const scrollRef = useRef();
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState([]);
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [addUser, setAddUser] = useState([]);
  const [searchResult, setSearchResult] = useState(false);
  const [addUserGroup, setAdddUserGroup] = useState(false);
  const { allChat, currentChat } = useSelector((state) => state.chat);
  const { allmessage } = useSelector((state) => state.message);
  const [loading, setLoading] = useState(false);
  const { currentUser, chatloading } = useSelector((state) => state.user);
  const { allNoti } = useSelector((state) => state.notification);
  const [chatname, setChatname] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const { isConnected } = useSelector((state) => state.socket); // Get connection status from Redux

  const user = currentUser?.others ? currentUser?.others : currentUser;
  const dispatch = useDispatch();
  // Socket //

  const [isTyping, setIsTyping] = useState(false);
  const [comment, setComment] = useState("");
  const [textAreaCount, setTextAreaCount] = useState("0/100");
  const max = 100;

  useEffect(() => {
    let socket;

    if (isConnected && currentUser) {
      socket = getSocket(); // Get the socket object

      // Emit setup event
      socket.emit("setup", currentUser);

      // Listen for typing events
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
      socket.on("message deleted", (newMessage) => {
        dispatch(
          messageSuccess(allmessage.filter((m) => m._id !== newMessage._id))
        );
      });
      socket.on("message recieved", async (newMessage) => {
        dispatch(messageSuccess([...allmessage, newMessage]));
      });
      // Cleanup socket listeners
      return () => {
        socket.off("typing");
        socket.off("stop typing");
        socket.off("message deleted");
        socket.off("message recieved");
      };
    }
  }, [isConnected, currentUser, allmessage, dispatch]);

  useEffect(() => {
    const getChat = async () => {
      try {
        dispatch(chatStart());
        const { data } = await axios.get(`${BASE_URL}/api/chat`);
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
        );
        dispatch(messageSuccess(data));

        if (isConnected) {
          const socket = getSocket(); // Get the socket object
          socket.emit("join room", currentChat._id); // Join the current chat room
        }
        setLoading(false);
      } catch (error) {
        dispatch(messageError());
        console.log(error?.response?.data);
      }
    };
    getMessage();
    // eslint-disable-next-line
  }, [currentChat]);


  const handleDelete = async (me) => {
    try {
      dispatch(messageStart());
      await axios.delete(`${BASE_URL}/api/message/delete/${me._id}`);
      dispatch(messageSuccess(allmessage.filter((m) => m._id !== me._id)));

      if (isConnected) {
        const socket = getSocket(); // Get the socket object
        socket.emit("new message delete", me);
      }

      setMessage(" ");
    } catch (error) {
      dispatch(messageError);
      console.log(error?.response?.data);
    }
  };

  const groupDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(chatStart());
      await axios.delete(
        `${BASE_URL}/api/chat/delete/` + currentChat._id
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
    setSelectedUser([]);
    setGroupSearch("");
    setChatname("");
    console.log(chatname);

    console.log("Cancel gruop");

  };
  const addGroup = (e) => {
    e.preventDefault();
    setAdddUserGroup(!addUserGroup);
  };

  const handleGroup = (addUser) => {
    if (selectedUser.includes(addUser)) {
      return;
    }
    setSelectedUser([...selectedUser, addUser]);
    setGroupSearch("");
  };

  const handleCancel = (deleteUser) => {
    setSelectedUser(selectedUser.filter((s) => s._id !== deleteUser._id));
  };

  const handleRemove = async (deleteUser) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/remove/` + currentChat._id,
        { userId: deleteUser._id }
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
        { userId: removeUser._id }
      );
      dispatch(chatSuccess(allChat.filter((c) => c._id !== currentChat._id)));
      dispatch(setCurrentChat(""));
      toast.success("Left group");
    } catch (error) {
      console.log(error);
    }
  };

  // const handleAdd = async (addUser) => {
  //   const Users = currentChat?.users?.map((u) => u._id);
  //   try {
  //     if (Users.includes(addUser._id)) {
  //       toast.error("Already included in grp ");
  //       return;
  //     } else {
  //       const { data } = await axios.put(
  //         `${BASE_URL}/api/chat/add/` + currentChat._id,
  //         { userId: addUser._id }
  //       );
  //       dispatch(setCurrentChat(data));
  //       toast.success("New member added in group");
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //     console.log(error);
  //   }
  // };

  const handleRename = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/rename/` + currentChat._id,
        { chatname: chatname }
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
        { name: chatname, users: JSON.stringify(selectedUser.map((u) => u._id)) }
      );

      dispatch(chatSuccess([data, ...allChat]));
      setCurrentChat(data);
      setSearchResult(!searchResult);
      toast.success("Group created");
      setChatname("");
      setSelectedUser([]);
    } catch (error) {
      console.log(error);
      dispatch(chatError());
    }
  };

  const recalculate = (text) => {
    const currentLength = text.length;
    setTextAreaCount(`${currentLength}/${max}`);
    setMessage(text)
    setComment(text)
  };

  const sendMessage = async (text) => {
    setMessage(text);
    if (text.length === 0) {
      toast.error("Please enter some message")
      return;
    }
    if (isConnected) {
      const socket = getSocket(); // Get the socket object
      socket.emit("stop typing", currentChat._id);
    }

    try {
      dispatch(messageStart());
      const { data } = await axios.post(
        `${BASE_URL}/api/message/` + currentChat._id,
        { content: message }
      );
      if (isConnected) {
        const socket = getSocket(); // Get the socket object
        socket.emit("send_message", data);
      }
      dispatch(messageSuccess([...allmessage, data]));
      setMessage("");
    } catch (error) {
      dispatch(messageError());
      console.log(error?.response?.data);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/freind/search`, {
          params: { name: query },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout); // Clear timeout on every new input
  };

  const handleGroupSearch = async (e) => {
    const query = e.target.value;
    setGroupSearch(query);

    if (query.trim() === "") {
      setAddUser([]);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/user/freind/search?name=` + query,
        );
        setAddUser(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout); // Clear timeout on every new input
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat, message]);

  return (
    <>
      <div className="flex w-full">
        {/* Destop view  */}
        <div className="hidden lg:flex w-full md:h-[calc(100vh-5.5rem)] border">
          <div className=" w-[40%] border border-y-0 border-l-0">
            <div className="flex justify-between items-center p-3">
              <div>
                <i
                  className="fa-solid fa-xl fa-user-plus ml-4 text-[#BED7F8] cursor-pointer"
                  onClick={handleGroupChat}
                ></i>
              </div>
            </div>
            {/* {search && <ChatSearchSkeleton/>} */}
            <div className=" p-3 h-[calc(100vh-8.6rem)] overflow-y-auto">
              {allChat ? (
                !chatloading ? (
                  allChat?.map((c) => (
                    <div
                      className=""
                      key={c?._id}
                      onClick={() => {
                        setSearchResult(false)
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
            <div className="message h-full w-[60%]">
              <div className="flex justify-between items-center message md:bg-[#84b6f7]">
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
                  {/* {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id === user?._id && (
                      <div>
                        <i
                          className="fa-solid fa-xl fa-user-plus mr-4 text-black cursor-pointer"
                          onClick={addGroup}
                        ></i>
                      </div>
                    )} */}
                </div>
              </div>

              {!loading ? (
                <div className=" md:bg-[#BED7F8] md:h-[calc(100vh-12.4rem)] p-3 overflow-y-auto">
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
                  className="bg-[#2D3B58] w-full flex items-center md:h-[calc(100vh-11.65rem)] flex-col  mx-auto"
                  thickness="100"
                  speed="600"
                  color="white"
                  secondaryColor="black"
                />
              )}
              <div className="flex items-center bg-[#455175] mb-1 lg:mb-2 rounded-md w-full">
                <div className="flex items-center w-[80%]">
                  <InputEmoji
                    value={comment}
                    onChange={recalculate}
                    cleanOnEnter
                    onEnter={sendMessage}
                    maxLength={max}
                    placeholder="Type a message" />
                </div>
                <p className="w-[20%] md:text-center">{textAreaCount}</p>
              </div>
            </div>
          ) : (
            <div className="flex m-auto items-center">
              <NopPreview />
            </div>
          )}
        </div>
        {/* -------- */}

        {/* Mobile view */}

        <div className="flex lg:hidden z-10 flex-col md:p-0 w-screen h-full">

          {!currentChat ? (
            <div className="conversation lg:flex-1">
              <div className="flex justify-between items-center md:p-3">
                <div className="flex md:hidden w-full items-center bg-white rounded-xl p-1">
                  <i className="fa-solid fa-xl text-[#2f3549] fa-magnifying-glass"></i>
                  <input value={search}
                    onChange={handleSearchChange} className="p-0.5 m-1 w-full focus:outline-none" placeholder="Search Friends" type="text" />
                </div>

                {search && searchResults.length > 0 ? (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 shadow-lg rounded-lg w-[95%] z-50">
                    <ul>
                      {searchResults.map((s, index) => (
                        <DirectMessage
                          key={index}
                          setSearched={setSearched}
                          setSearch={setSearch}
                          search={s}
                        />
                      ))}
                    </ul>
                  </div>
                ) : (
                  search && <div className="absolute top-16 bg-[#7c8bb9] left-1/2 transform -translate-x-1/2 shadow-lg rounded-lg w-[95%] z-50">
                    <ul>
                      <h1 className="p-2 text-center text-white font-bold">No search result</h1>
                    </ul>
                  </div>)}
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
                <div className="flex justify-between items-center">
                  <div>
                    <i
                      className="fa-solid fa-xl fa-user-plus ml-4 text-[#BED7F8] cursor-pointer"
                      onClick={handleGroupChat}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="h-[calc(100vh-9rem)] p-1 overflow-y-auto">
                {allChat ? (
                  !chatloading ? (
                    allChat?.map((c) => (
                      <div
                        className="individual-chat"
                        key={c?._id}
                        onClick={() => {
                          setSearchResult(false)
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
            <div className="message w-full">
              <div className="flex justify-between items-center message bg-[#8cbeff] lg:hidden">
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
                  {/* {currentChat?.isGroupChat &&
                    currentChat?.groupAdmin?._id === user?._id && (
                      <div>
                        <i
                          className="fa-solid fa-xl fa-user-plus mr-4 text-black cursor-pointer"
                          onClick={addGroup}
                        ></i>
                      </div>
                    )} */}
                </div>
              </div>
              {!loading ? (
                <div className="h-[calc(100vh-11.9rem)] bg-[#BED7F8]  p-3 overflow-y-auto">
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
                  className="bg-[#2D3B58] w-full flex items-center h-[calc(100vh-11.9rem)] flex-col  mx-auto"
                  thickness="100"
                  speed="600"
                  color="white"
                  secondaryColor="black"
                />
              )}
              <div className="w-full max-w-4xl mx-auto px-2">
                <div className="flex items-center bg-[#455175] mb-1 lg:mb-2 rounded-md w-full relative">

                  {/* Input Section */}
                  <div className="flex items-center flex-1 min-w-0">
                    <InputEmoji
                      value={comment}
                      onChange={recalculate}
                      cleanOnEnter
                      onEnter={sendMessage}
                      maxLength={max}
                      placeholder="Type a message"
                    // pickerStyle={{
                    //   zIndex: 100,
                    //   width: window.innerWidth < 640 ? "95vw" : "350px",
                    //   maxWidth: "100%",
                    //   bottom: "60px",
                    // }}
                    />
                  </div>

                  {/* Character Counter */}
                  <p className="px-3 text-sm md:text-base text-center whitespace-nowrap">
                    {textAreaCount}
                  </p>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* ---------- */}
      </div>

      {searchResult && (
        <div className="fixed flex z-40 top-0 mt-24  w-screen lg:w-[32rem] xl:w-[36rem] md:w-96">
          <form
            className="bg-[#2D3B58] h-full  m-auto w-11/12 border"
            onSubmit={create}
          >
            <h1 className="text-2xl font-bold text-white text-center">
              Create group chat
            </h1>
            <div className="h-14 w-full p-1 mt-2 ">
              <input
                className="focus:outline-slate-900 w-full h-full p-1"
                type="text"
                placeholder="Enter group Name"
                value={chatname}
                onChange={(e) => setChatname(e.target.value)}
                required
              />
            </div>
            <div className="h-14 w-full p-1 ">
              <input
                className="focus:outline-slate-900 w-full h-full p-1"
                type="text"
                placeholder="Add user eg leander06"
                value={groupSearch}
                onChange={handleGroupSearch}
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
              {groupSearch && addUser.length > 0 ? (addUser?.slice(0, 6).map((a) => (
                <GroupUser
                  user={a}
                  key={a._id}
                  handleFunction={() => handleGroup(a)}
                />
              ))) : groupSearch && <ul>
                <h1 className="p-2 text-center text-white font-bold">No search result</h1>
              </ul>}
            </div>
            <div className=" flex justify-around mb-2  ml-2 rounded p-1">
              <input
                className=" text-white p-1 rounded text-center cursor-pointer"
                value="Create chat"
                type="submit"
              />
              <input
                className=" text-white p-1 rounded text-center cursor-pointer"
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
                onChange={handleGroupSearch}
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

              {groupSearch && addUser.length > 0 ? (addUser?.slice(0, 6).map((a) => (
                <GroupUser
                  user={a}
                  key={a._id}
                  handleFunction={() => handleGroup(a)}
                />
              ))) : groupSearch && <ul>
                <h1 className="p-2 text-center text-white font-bold">No search result</h1>
              </ul>}
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
