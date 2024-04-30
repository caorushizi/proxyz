import { REQUEST_TIME_OUT } from "./const";
import { failedResourceCache, requestsCache } from "./utils";

export function getFailResources(tabId: number) {
  const tab = failedResourceCache.get(tabId);
  if (tab) {
    return [...tab];
  }
  return [];
}

const filter: chrome.webRequest.RequestFilter = {
  urls: ["<all_urls>"],
};

function beforeRequestHandler(
  details: chrome.webRequest.WebRequestBodyDetails,
) {
  // 判断 url 以 http 或 https 开头
  if (!/^https?:\/\//.test(details.url)) {
    return;
  }
  requestsCache.set(details.requestId, {
    url: details.url,
    method: details.method,
    requestId: details.requestId,
    tabId: details.tabId,
    timestamp: details.timeStamp,
  });

  setTimeout(async () => {
    const request = requestsCache.get(details.requestId);
    if (!request) {
      return;
    }

    const tabReq = failedResourceCache.get(request.tabId) || new Set();
    tabReq.add(request.url);

    await chrome.action.setBadgeText({
      text: `${tabReq.size}`,
      tabId: request.tabId,
    });

    failedResourceCache.set(request.tabId, tabReq);
  }, REQUEST_TIME_OUT);
}

function completedHandler(details: chrome.webRequest.WebResponseCacheDetails) {
  requestsCache.delete(details.requestId);
}

function errorHandler(details: chrome.webRequest.WebResponseErrorDetails) {
  requestsCache.delete(details.requestId);
}

function redirectHandler(
  details: chrome.webRequest.WebRedirectionResponseDetails,
) {
  requestsCache.delete(details.requestId);
}

function headersReceivedHandler(
  details: chrome.webRequest.WebResponseHeadersDetails,
) {
  requestsCache.delete(details.requestId);
}

function init() {
  chrome.webRequest.onBeforeRequest.addListener(beforeRequestHandler, filter);
  chrome.webRequest.onHeadersReceived.addListener(
    headersReceivedHandler,
    filter,
  );
  chrome.webRequest.onBeforeRedirect.addListener(redirectHandler, filter);
  chrome.webRequest.onErrorOccurred.addListener(errorHandler, filter);
  chrome.webRequest.onCompleted.addListener(completedHandler, filter);
}

export default init;
