import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import db from "../db/profile";
import { Profile } from "../helper/constant";

const initialState: Profile[] = [];

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
      });
  },
});

export const { todoAdded } = profilesSlice.actions;
export const selectProfiles = (state: RootState) => state.profiles;

export const initProfiles = createAsyncThunk("posts/initProfiles", async () => {
  const profiles = await db.getProfiles();
  return profiles;
});

export const addProfile = createAsyncThunk(
  "posts/addProfile",
  async (item: Pick<Profile, "name" | "type" | "color">) => {
    const id = await db.addProfile(item.name, item.type, item.color);
    const profile = await db.findProfile(id);
    return profile;
  },
);

export const selectProfileById = createSelector(
  [(state: RootState) => state.profiles, (_, id: number) => id],
  (state, id) => {
    return state.find((profile) => profile.id === id);
  },
);

export default profilesSlice.reducer;
