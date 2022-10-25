import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allComment:[],
  isloading:false,
  error:false
}


export const CommentSlice = createSlice({
      name: 'comment',
      initialState,
      reducers: {
        commentStart:(state) =>{
              state.isloading=true
        },
        commentSuccess:(state,action) =>{
            state.isloading=false
            state.allComment= action.payload
        },
        commentError:(state) =>{
            state.isloading=false
            state.error=true
        },
      },
})
    


export const { commentStart,commentSuccess,commentError} = CommentSlice.actions


export default CommentSlice.reducer    