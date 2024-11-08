import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { userSlice } from "./userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {reservationSlice} from "./reservation/reservationSlice";
import allUsersSlice from "./allUsers/allUsersSlice";
import {roomSlice} from "./room/roomSlice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  reservation: reservationSlice.reducer,
  allUsers: allUsersSlice.reducer ,
  room: roomSlice.reducer
});
export const store = configureStore({
  reducer: rootReducer,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
