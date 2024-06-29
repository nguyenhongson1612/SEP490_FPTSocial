import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActivePost: null,
  isShowModalActivePost: false,
}

//initial slice in store
export const activePostSlice = createSlice({
  name: 'activePost',
  initialState,
  reducers: {
    showModalActivePost: (state) => {
      state.isShowModalActivePost = true
    },
    clearAndHireCurrentActivePost: (state) => {
      state.currentActivePost = null,
      state.isShowModalActivePost = false
    },
    updateCurrentActiveCard: (state, action) => {
      state.currentActivePost = action.payload
    }
  },
  extraReducers: ( builder ) => {}
})

export const {
  showModalActivePost,
  clearAndHireCurrentActivePost,
  updateCurrentActiveCard
} = activePostSlice.actions

export const selectCurrentActivePost = ( state ) => {
  return state.activePost.currentActivePost
}
export const selectIsShowModalActivePost = ( state ) => {
  return state.activePost.isShowModalActivePost
}

export const activePostReducer = activePostSlice.reducer