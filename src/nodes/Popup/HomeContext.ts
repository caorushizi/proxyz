import { Dispatch, createContext, useContext } from "react";
import { ProfileType } from "../../helper/constant";

export enum PageType {
  Home = "home",
  Unload = "unload",
  Add = "add",
}

export interface Action {
  type: string;
  payload: any;
}

export interface HomeState {
  profiles: ProfileType[];
  active: string;
  domain: string;
  urls: string[];
  page: PageType;
}

export const initialHomeState: HomeState = {
  profiles: [],
  active: "",
  domain: "",
  urls: [],
  page: PageType.Home,
};

export const HomeContext = createContext(initialHomeState);

export const HomeDispatchContext = createContext(
  (() => {}) as Dispatch<Action>,
);

export function useHomeState() {
  return useContext(HomeContext);
}

export function useHomeStateDispatch() {
  return useContext(HomeDispatchContext);
}

export function setMenuItem(key: string): Action {
  return {
    type: "setMenuItem",
    payload: key,
  };
}

export function initState(payload: any): Action {
  return { type: "init", payload };
}

export function setPage(page: PageType): Action {
  return {
    type: "setPage",
    payload: page,
  };
}
