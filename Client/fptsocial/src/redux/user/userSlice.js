import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'


export const getUserByNumberAPI = createAsyncThunk(
  'user/getUserByNumberAPI',
  async () => {
    const response = await authorizedAxiosInstance.get('https://localhost:44329/api/UserProfile/getuserbynumber',
      {
        params: {
          UserNumber: '164026'
        },
        headers: {
          'X-XSRF-TOKEN': 'CfDJ8PitB5EGtQxHuVCBkp5as6Ymc2JN2dnPNP3m1P9aP5FZHTQhyAkClJKzZTQACMwbP1THgexjM-41007vfOD5qaNTkq5XnVIw7BLGP8NxKcws2n-nt1KDhX-Su-DLGTovB8LTIvz2KcZXs5sLC_vlQKM'
        }
      }
    )
    console.log(response);
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
    builder.addCase(getUserByNumberAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer