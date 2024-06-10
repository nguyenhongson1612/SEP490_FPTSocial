import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'


export const getUserByNumberAPI = createAsyncThunk(
  'user/getUserByNumberAPI',
  async () => {
    const response = await authorizedAxiosInstance.get('https://localhost:44329/api/UserProfile/getuserbynumber',
      {
        params: {
          UserNumber: 'usernumber1'
        },
        headers: {
          'X-XSRF-TOKEN': 'C805657E-EDB1-4942-A22D-BE7BADFD1FE2'
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