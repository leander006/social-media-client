import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  imgUrl: '',
  imagePreview: '',
}

export const ImageSlice = createSlice({
      name: 'chat',
      initialState,
      reducers: {
        setImgUrl: (state, action) => {
          state.imgUrl = action.payload;
        },
        setImagePreview: (state, action) => {
          state.imagePreview = action.payload;
        },
      },
})
    


export const { setImgUrl,setImagePreview} = ImageSlice.actions


export default ImageSlice.reducer    