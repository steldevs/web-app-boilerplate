import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import mainSlice from './mainSlice'

export const reducer = mainSlice.reducer;

export default configureStore({
  reducer: reducer,
  middleware: [
    store => next => action => {
      const result = next(action);
      if(action.type === "mainReducers/loginUserState"){
        localStorage.setItem("username", action.payload.user.username);
      }
      if(action.type === "mainReducers/logoutUserState"){
        localStorage.removeItem("username");
      }
      return result;
      // Above middleware is to know to request token refresh only if a user was already logged in.
      // Does not offer any true security enhancement.
    }
  ]
})