import { configureStore } from "@reduxjs/toolkit";
import profilesReducer from "./profilesSlice";
import popupReducer from "./popupSlice";

export const store = configureStore({
  reducer: {
    profiles: profilesReducer,
    popup: popupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
