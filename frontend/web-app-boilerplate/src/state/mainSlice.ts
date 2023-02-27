import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Root, LoginAction } from './types'


const initState: Root = {
    user: null
}

export const mainSlice = createSlice({
  name: 'mainReducers',
  initialState: initState,
  reducers: {
    loginUserState(state, action: PayloadAction<LoginAction>){
      state.user = action.payload.user;
    },
    logoutUserState(state){
      state.user = null;
    },
    persistUserState(state, action: PayloadAction<LoginAction>){
      state.user = action.payload.user;
    }
  },
})

export const { loginUserState, logoutUserState, persistUserState } = mainSlice.actions

export default mainSlice;