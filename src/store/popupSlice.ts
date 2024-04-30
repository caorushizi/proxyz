import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { PopupPageType } from "../helper/constant";
import { invoke } from "../hooks/chrome";

export interface PopupState {
  page: PopupPageType;
  activeId: string;
  currUrl: string;
  // 加载失败的资源url
  resources: string[];
}

const initialState: PopupState = {
  page: PopupPageType.PopupMenu,
  activeId: "",
  currUrl: "",
  resources: [],
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setActiveId(state, action) {
      state.activeId = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(initPopup.fulfilled, (state, action) => {
      state.activeId = action.payload.activeId;
      state.currUrl = action.payload.currUrl;
      state.resources = action.payload.resources;
    });
  },
});

export const selectPopupState = (state: RootState) => state.popup;

async function getTabInfo() {
  const tabInfo: any = {};

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  // 获取当前的 url
  if (tab.url && /^https?:\/\//.test(tab.url)) {
    tabInfo.currUrl = tab.url;
  }

  if (tab.id) {
    const res = await invoke({ message: "getFailResources", params: tab.id });
    tabInfo.resources = res;
  }
  return tabInfo;
}

async function getActive() {
  const { activeId } = await chrome.storage.local.get("activeId");
  return activeId;
}

export const initPopup = createAsyncThunk("popup/initPopup", async () => {
  const [tabInfo, activeId] = await Promise.all([getTabInfo(), getActive()]);
  return {
    ...tabInfo,
    activeId,
  };
});

export const selectActiveProfile = (state: RootState) => {
  return state.profiles.find((i) => String(i.id) === state.popup.activeId);
};

export const { setActiveId, setPage } = popupSlice.actions;

export default popupSlice.reducer;
