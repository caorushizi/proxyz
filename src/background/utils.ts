import { LRUCache } from "lru-cache";
import mitt, { Emitter } from "mitt";
import { RequestDetails } from "./types";
import { Profile } from "../helper/constant";

const options = {
  max: 500,
};

export const cache = new LRUCache<string, RequestDetails>(options);
export const requestCache = new LRUCache<number, Set<RequestDetails>>(options);

export type Events = {
  changeProxy: Profile;
  direct: boolean;
};

export const emitter: Emitter<Events> = mitt();
