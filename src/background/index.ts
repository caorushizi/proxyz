import initRequest from "./request";
import initProxy from "./proxy";
import initIcon from "./icon";
import initEvent from "./event";

initIcon();
initRequest();
initProxy();
initEvent();

function init() {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
      // 设置icon
      await chrome.action.setBadgeText({
        text: "",
        tabId,
      });
    }
  });
}

init();
