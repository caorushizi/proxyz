/* eslint-disable @typescript-eslint/no-var-requires */
const pm = require("picomatch");

const isMatch = pm("*.google.com");

function FindProxyForURL(url: string, host: string) {
  if (isMatch(host)) {
    return "PROXY localhost:7890;";
  }
  return "DIRECT;";
}

globalThis.FindProxyForURL = FindProxyForURL;
