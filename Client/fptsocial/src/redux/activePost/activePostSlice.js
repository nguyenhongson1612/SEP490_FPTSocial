import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActivePost: null,
  isShowModalActivePost: false,
  reloadComment: false
}

//initial slice in store
export const activePostSlice = createSlice({
  name: 'activePost',
  initialState,
  reducers: {
    showModalActivePost: (state) => {
      state.isShowModalActivePost = true
    },
    triggerReloadComment: (state) => {
      state.reloadComment = !state.reloadComment
    },
    clearAndHireCurrentActivePost: (state) => {
      state.currentActivePost = null,
        state.isShowModalActivePost = false
    },
    updateCurrentActivePost: (state, action) => {
      state.currentActivePost = action.payload
    }
  },
  extraReducers: (builder) => { }
})

export const {
  showModalActivePost,
  triggerReloadComment,
  clearAndHireCurrentActivePost,
  updateCurrentActivePost
} = activePostSlice.actions

export const selectCurrentActivePost = (state) => {
  return state.activePost.currentActivePost
}
export const selectIsShowModalActivePost = (state) => {
  return state.activePost.isShowModalActivePost
}

export const reLoadComment = (state) => {
  return state.activePost.reloadComment
}

export const activePostReducer = activePostSlice.reducer