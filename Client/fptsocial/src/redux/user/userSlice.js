import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getUserByNumber = createAsyncThunk(
  'user/getUserByNumbe', async (userNumber) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getuserbynumber`, {
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
  reducers: {
    logoutCurrentUser: (state, action) => {
      state.currentUser = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserByNumber.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

export const { logoutCurrentUser } = userSlice.actions
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer