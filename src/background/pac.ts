import { minimatch } from "minimatch";

// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file
const autoHost = globalThis.__REPLACE_HOST__;
const auto = (host: string) => autoHost.some((url) => minimatch(host, url));
const proxy = (host: string) => {
  if (
    /^127\\.0\\.0\\.1$/.test(host) ||
    /^::1$/.test(host) ||
    /^localhost$/.test(host)
  ) {
    return "DIRECT;";
  }
  return "PROXY localhost:7897;";
};

// FIXME: incompatibility problem
globalThis.FindProxyForURL = function (url, host) {
  if (auto(host)) {
    return proxy(host);
  }

  return "DIRECT;";
};

interface MyGlobal extends Window {
  FindProxyForURL: (url: string, host: string) => string;
  __REPLACE_HOST__: string[];
}

declare const globalThis: MyGlobal;
