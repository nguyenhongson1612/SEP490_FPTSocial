import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

export const getUserByNumber = createAsyncThunk(
  'user/getUserByNumbe', async (userNumber) => {
    const response = await authorizedAxiosInstance.get('https://localhost:44329/api/UserProfile/getuserbynumber', {
      params: {
        UserNumber: userNumber
      }
    })
    return response.data?.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserByNumber.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer