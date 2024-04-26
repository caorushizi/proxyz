import { LRUCache } from "lru-cache";
import { RequestDetails } from "./types";

const options = {
  max: 500,
};

export const cache = new LRUCache<string, RequestDetails>(options);
