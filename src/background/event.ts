import { setDirect, setProfile, setSystem } from "./proxy";
import { getFailResources } from "./request";
import { fail, info, success, warn } from "./utils";

const handleMap: Record<string, any> = {
  setDirect,
  setSystem,
  setProfile,
  getFailResources,
};

async function handle() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    info("event.ts", request);
    const { message = "" } = request || {};
    const handler = handleMap[message];
    if (!handler) {
      warn("没有可用的 handler", request);
      return sendResponse(fail("Invalid message"));
    }

    const value = handler(request.params);
    if (value instanceof Promise) {
      value
        .then((data) => {
          return sendResponse(success(data));
        })
        .catch((e) => {
          return sendResponse(fail(e.message));
        });
      return true;
    }

    try {
      return sendResponse(success(value));
    } catch (e: any) {
      return sendResponse(fail(e.message));
    }
  });
}

function init() {
  handle();
}

export default init;
