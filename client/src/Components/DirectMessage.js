import React from 'react'
import Cookie from "js-cookie"  
import {axiosInstance} from '../Config';
import { useDispatch, useSelector } from 'react-redux';
import { chatError, chatStart, chatSuccess, setCurrentChat } from '../redux/Slice/chatSlice';

function DirectMessage({search,setSearched,setSearch}) {

  const {allChat} = useSelector(state => state.chat)
  const dispatch = useDispatch()
  const config ={
      headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${Cookie.get('token')}`
      }
    }

  const openChat = async(e) =>{
        e.preventDefault()
        try {
          dispatch(chatStart())
          const {data} = await axiosInstance.post("/chat/"+search._id,{},config)
          if(typeof(data.res) === "string"){
            dispatch(setCurrentChat(data.chat))
            setSearched([])
            setSearch("");
            return 
          }
          dispatch(chatSuccess([data,...allChat,]))
          dispatch(setCurrentChat(data))
          console.log("search");
          setSearched([])
      } catch (error) {
          dispatch(chatError())
          console.log(error);
      }
  }

  return (
    <>
    <div className='flex bg-slate-300 p-2 cursor-pointer items-center' onClick={openChat}>
    <img src={search.profile} className="rounded-full h-10 w-10"/>
          <div className="flex-1 ml-2">
                <div>{search.username}</div>
          </div>  
    </div>
  
</>
  )
}

export default DirectMessage