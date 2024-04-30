import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  AutoProxyRule,
  Profile,
  ProfileType,
  ProxyMode,
} from "../helper/constant";
import {
  addProfile,
  deleteProfile,
  findProfile,
  getProfiles,
  updateProfile,
} from "../db/profile";
import { produce } from "immer";

const initialState: ProfileType[] = [];

const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    todoAdded() {},
  },
  extraReducers(builder) {
    builder
      .addCase(initProfilesAction.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addProfileAction.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateProfileAction.fulfilled, (state, action) => {
        const index = state.findIndex(
          (profile) => profile.id === action.payload.id,
        );
        state[index] = action.payload;
      })
      .addCase(addAutoConditionAction.fulfilled, (state, action) => {
        const index = state.findIndex(
          (profile) => profile.id === action.payload.id,
        );
        state[index] = action.payload;
      })
      .addCase(deleteProfileAction.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export const { todoAdded } = profilesSlice.actions;
export const selectProfiles = (state: RootState) => state.profiles;

export const initProfilesAction = createAsyncThunk(
  "profiles/initProfiles",
  async () => {
    const profiles = await getProfiles();
    await chrome.storage.local.set({ profiles });
    return profiles;
  },
);

export const addProfileAction = createAsyncThunk(
  "profiles/addProfile",
  async (item: Omit<ProfileType, "id">) => {
    const id = await addProfile(item);
    const profile = await findProfile(id);
    return profile;
  },
);

export const deleteProfileAction = createAsyncThunk(
  "profiles/deleteProfile",
  async (id: number) => {
    await deleteProfile(id);
    const profiles = await getProfiles();
    return profiles;
  },
);

export const addAutoConditionAction = createAsyncThunk(
  "profiles/addAutoCondition",
  async ({ rules, id }: { rules: AutoProxyRule[]; id: number }) => {
    const profile = await findProfile(id);
    const nextProfile = produce<Profile<ProxyMode.Auto>>(profile, (draft) => {
      draft.options.rules.push(...rules);
    });
    await updateProfile(nextProfile);
    return nextProfile;
  },
);

export const updateProfileAction = createAsyncThunk(
  "profiles/updateProfile",
  async (item: ProfileType) => {
    await updateProfile(item);
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
