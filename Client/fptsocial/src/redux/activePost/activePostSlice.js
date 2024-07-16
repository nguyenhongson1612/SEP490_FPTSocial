import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActivePost: null,
  isShowModalActivePost: false,
  isShowUpdatePost: false,
  isShowModalSharePost: false,
  isShowModalCreatePost: false,
  postReactStatus: null,
  handleUpdatePostReactStatus: null,
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
    showModalUpdatePost: (state) => {
      state.isShowUpdatePost = true
    },
    showModalSharePost: (state) => {
      state.isShowModalSharePost = true
    },
    showModalCreatePost: (state) => {
      state.isShowModalCreatePost = true
    },
    triggerReloadComment: (state) => {
      state.reloadComment = !state.reloadComment
    },
    updatePostReactStatus: (state, action) => {
      state.postReactStatus = action.payload
    },
    clearAndHireCurrentActivePost: (state) => {
      state.currentActivePost = null,
        state.postReactStatus = null,
        state.isShowModalActivePost = false,
        state.isShowUpdatePost = false,
        state.isShowModalSharePost = false,
        state.isShowModalCreatePost = false
    },
    updateCurrentActivePost: (state, action) => {
      state.currentActivePost = action.payload
    }
  },
  extraReducers: (builder) => { }
})

export const {
  showModalActivePost,
  showModalUpdatePost,
  showModalSharePost,
  showModalCreatePost,
  triggerReloadComment,
  clearAndHireCurrentActivePost,
  updatePostReactStatus,
  updateCurrentActivePost
} = activePostSlice.actions

export const selectCurrentActivePost = (state) => {
  return state.activePost.currentActivePost
}
export const selectIsShowModalActivePost = (state) => {
  return state.activePost.isShowModalActivePost
}
export const selectIsShowModalSharePost = (state) => {
  return state.activePost.isShowModalSharePost
}
export const selectIsShowModalUpdatePost = (state) => {
  return state.activePost.isShowUpdatePost
}
export const selectIsShowModalCreatePost = (state) => {
  return state.activePost.isShowModalCreatePost
}
export const selectPostReactStatus = (state) => {
  return state.activePost.postReactStatus
}

export const reLoadComment = (state) => {
  return state.activePost.reloadComment
}

export const activePostReducer = activePostSlice.reducer