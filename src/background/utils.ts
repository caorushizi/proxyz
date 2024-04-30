import { LRUCache } from "lru-cache";
import mitt, { Emitter } from "mitt";
import { RequestDetails } from "./types";
import { ProfileType } from "../helper/constant";

const options = {
  max: 500,
};

export const requestsCache = new LRUCache<string, RequestDetails>(options);
export const failedResourceCache = new LRUCache<number, Set<string>>(options);

export type Events = {
  direct: boolean;
  setDirect: void;
  setSystem: void;
  setProfile: ProfileType;
};

export const emitter: Emitter<Events> = mitt();

export function info(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[INFO] `, ...args);
  }
}

export function warn(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[WARN] `, ...args);
  }
}

export function error(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] `, ...args);
  }
}

export function success(data?: any) {
  return {
    status: 0,
    message: "success",
    data,
  };
}

export function fail(message: string) {
  return {
    status: 1,
    message,
    data: null,
  };
}
