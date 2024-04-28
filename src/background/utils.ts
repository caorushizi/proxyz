import { LRUCache } from "lru-cache";
import mitt, { Emitter } from "mitt";
import { RequestDetails } from "./types";
import { ProfileType } from "../helper/constant";

const options = {
  max: 500,
};

export const cache = new LRUCache<string, RequestDetails>(options);
export const requestCache = new LRUCache<number, Set<RequestDetails>>(options);

export type Events = {
  changeProxy: ProfileType;
  direct: boolean;
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
