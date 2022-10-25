import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allmessage: [],
  messageloading:false,
  error:false,
  
}


export const MessageSlice = createSlice({
      name: 'message',
      initialState,
      reducers: {
        messageStart:(state) =>{
              state.messageloading=true
        },
        messageSuccess:(state,action) =>{
            state.messageloading=false
            state.allmessage= action.payload
        },
        messageError:(state) =>{
            state.messageloading=false
            state.error=true
        },
        
      },
})
    


export const { messageStart,messageSuccess,messageError} = MessageSlice.actions


export default MessageSlice.reducer    