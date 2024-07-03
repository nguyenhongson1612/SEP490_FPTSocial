import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { activePostReducer } from './activePost/activePostSlice'
import { uiStateReducer } from './ui/uiSlice'
import { notificationReducer } from './notification/notificationSlice'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user']
  // blacklist: ['user']
}

const reducers = combineReducers({
  user: userReducer,
  activePost: activePostReducer,
  uiState: uiStateReducer,
  notification: notificationReducer
})
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})