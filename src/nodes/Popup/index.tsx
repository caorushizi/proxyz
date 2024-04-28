import { Skeleton, Space } from "antd";
import React, { Suspense, lazy, useReducer } from "react";
import db from "../../db/profile";
import { useAsyncEffect } from "ahooks";
import { produce } from "immer";
import {
  Action,
  HomeContext,
  HomeDispatchContext,
  HomeState,
  PageType,
  initState,
  initialHomeState,
} from "./HomeContext";

const Home = lazy(() => import("./components/Home"));
const Unload = lazy(() => import("./components/Unload"));
const Add = lazy(() => import("./components/Add"));

async function getTabInfo() {
  const tabInfo: any = {};

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  // 获取当前的 url
  if (tab.url && /^https?:\/\//.test(tab.url)) {
    const url = new URL(tab.url);
    const wildcard = url.hostname.replace(/^[^.]+/, "*");
    tabInfo.wildcard = wildcard;
  }

  if (tab.id) {
    const { reqs } = await chrome.runtime.sendMessage({
      getRequest: tab.id,
    });
    tabInfo.urls = (reqs || []).map((req: any) => req.url);
  }
  return tabInfo;
}

async function getProfiles() {
  const profiles = await db.getProfiles();
  await chrome.storage.local.set({ profiles });
  return profiles;
}

async function getActive() {
  const { active } = await chrome.storage.local.get("active");
  return active;
}

async function init() {
  return Promise.all([getTabInfo(), getProfiles(), getActive()]);
}

const renderSkeleton = () => {
  return (
    <Space
      direction="vertical"
      style={{ width: 230, padding: 10 }}
      size="large"
    >
      <Skeleton.Input size="large" active block />
      <Skeleton.Input size="large" active block />
      <Skeleton.Input size="large" active block />
      <Skeleton.Input size="large" active block />
    </Space>
  );
};

const Popup = () => {
  const [homeState, dispatch] = useReducer(
    produce((draft: HomeState, action: Action) => {
      switch (action.type) {
        case "init":
          draft.profiles = action.payload.profiles;
          draft.active = action.payload.active;
          draft.domain = action.payload.tabInfo.wildcard;
          draft.urls = action.payload.tabInfo.urls;
          break;
        case "setMenuItem":
          draft.active = action.payload;
          break;
        case "setPage":
          draft.page = action.payload;
          break;
        default:
          break;
      }
    }),
    initialHomeState,
  );

  useAsyncEffect(async () => {
    const [tabInfo, profiles, active] = await init();
    dispatch(initState({ tabInfo, profiles, active }));
  }, []);

  return (
    <HomeContext.Provider value={homeState}>
      <HomeDispatchContext.Provider value={dispatch}>
        {homeState.page === PageType.Home && (
          <Suspense fallback={renderSkeleton()}>
            <Home />
          </Suspense>
        )}
        {homeState.page === PageType.Unload && (
          <Suspense fallback={renderSkeleton()}>
            <Unload />
          </Suspense>
        )}
        {homeState.page === PageType.Add && (
          <Suspense fallback={renderSkeleton()}>
            <Add />
          </Suspense>
        )}
      </HomeDispatchContext.Provider>
    </HomeContext.Provider>
  );
};

export default Popup;
