import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allChat: [],
  chatloading:false,
  error:false,
  currentChat:false,
}



export const ChatSlice = createSlice({
      name: 'chat',
      initialState,
      reducers: {
        chatStart:(state) =>{
              state.chatloading=true
        },
        chatSuccess:(state,action) =>{
            state.chatloading=false
            state.allChat= action.payload
        },
        chatError:(state) =>{
            state.chatloading=false
            state.error=true
        },
        setCurrentChat:(state,action)=>{
          state.currentChat=action.payload
        }
      },
})
    


export const { chatStart,chatSuccess,chatError,setCurrentChat} = ChatSlice.actions


export default ChatSlice.reducer    