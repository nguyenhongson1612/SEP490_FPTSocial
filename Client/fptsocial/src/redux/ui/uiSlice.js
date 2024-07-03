import { createSlice } from '@reduxjs/toolkit'

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    isShowHomeLeftSideBar: false
  },
  reducers: {
    triggerHomeLeftSideBar: (state) => {
      state.isShowHomeLeftSideBar = !state.isShowHomeLeftSideBar
    }
  },
  extraReducers: (builder) => { }
})

export const {
  triggerHomeLeftSideBar
} = uiStateSlice.actions

export const selectIsShowHomeLeftSideBar = (state) => {
  return state.uiState.isShowHomeLeftSideBar
}

export const uiStateReducer = uiStateSlice.reducer