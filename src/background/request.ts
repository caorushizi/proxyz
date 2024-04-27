import { REQUEST_TIME_OUT } from "./const";
import { cache, requestCache } from "./utils";

const filter: chrome.webRequest.RequestFilter = {
  urls: ["<all_urls>"],
};

function beforeRequestHandler(
  details: chrome.webRequest.WebRequestBodyDetails,
) {
  cache.set(details.requestId, {
    url: details.url,
    method: details.method,
    requestId: details.requestId,
    tabId: details.tabId,
    timestamp: details.timeStamp,
  });

  setTimeout(() => {
    const request = cache.get(details.requestId);
    if (request) {
      chrome.action.setBadgeText({ text: "1", tabId: request.tabId });
      const tabReq = requestCache.get(request.tabId);
      if (tabReq) {
        tabReq.add(request);
      } else {
        requestCache.set(details.tabId, new Set([request]));
      }
    }
  }, REQUEST_TIME_OUT);
}

function completedHandler(details: chrome.webRequest.WebResponseCacheDetails) {
  cache.delete(details.requestId);
}

function errorHandler(details: chrome.webRequest.WebResponseErrorDetails) {
  cache.delete(details.requestId);
}

function redirectHandler(
  details: chrome.webRequest.WebRedirectionResponseDetails,
) {
  cache.delete(details.requestId);
}

function headersReceivedHandler(
  details: chrome.webRequest.WebResponseHeadersDetails,
) {
  cache.delete(details.requestId);
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
