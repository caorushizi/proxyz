import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import db from "../db/profile";
import { ProfileType } from "../helper/constant";

const initialState: ProfileType[] = [];

const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    todoAdded() {},
  },
  extraReducers(builder) {
    builder
      .addCase(initProfiles.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addProfile.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const index = state.findIndex(
          (profile) => profile.id === action.payload.id,
        );
        state[index] = action.payload;
      });
  },
});

export const { todoAdded } = profilesSlice.actions;
export const selectProfiles = (state: RootState) => state.profiles;

export const initProfiles = createAsyncThunk(
  "profiles/initProfiles",
  async () => {
    const profiles = await db.getProfiles();
    await chrome.storage.local.set({ profiles });
    return profiles;
  },
);

export const addProfile = createAsyncThunk(
  "profiles/addProfile",
  async (item: Omit<ProfileType, "id">) => {
    const id = await db.addProfile(item);
    const profile = await db.findProfile(id);
    return profile;
  },
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async (item: ProfileType) => {
    await db.updateProfile(item);
    return item;
  },
);

export const selectProfileById = createSelector(
  [(state: RootState) => state.profiles, (_, id: number) => id],
  (state, id) => {
    return state.find((profile) => profile.id === id);
  },
);

export default profilesSlice.reducer;
