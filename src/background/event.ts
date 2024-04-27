import { Events, emitter, requestCache } from "./utils";

function handleMessage(
  key: string,
  val: number,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void,
) {
  if (key === "getRequest" && val) {
    const reqs = requestCache.get(val);
    sendResponse({ reqs });
  }

  sendResponse({ status: "ok" });
}

function init() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    Object.keys(request).forEach((key) => {
      if (!key.startsWith("get")) {
        emitter.emit(key as keyof Events, request[key]);
        return;
      }
      const val = request[key];
      handleMessage(key, val, sender, sendResponse);
    });
  });
}

export default init;
