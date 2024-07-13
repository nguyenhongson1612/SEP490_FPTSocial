import { createSlice } from '@reduxjs/toolkit'

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    isShowHomeLeftSideBar: false,
    isReload: false
  },
  reducers: {
    triggerHomeLeftSideBar: (state) => {
      state.isShowHomeLeftSideBar = !state.isShowHomeLeftSideBar
    },
    triggerReload: (state) => {
      state.isReload = !state.isReload
    }
  },
  extraReducers: (builder) => { }
})

export const {
  triggerHomeLeftSideBar,
  triggerReload
} = uiStateSlice.actions

export const selectIsShowHomeLeftSideBar = (state) => {
  return state.uiState.isShowHomeLeftSideBar
}
export const selectIsReload = (state) => {
  return state.uiState.isReload
}

export const uiStateReducer = uiStateSlice.reducer