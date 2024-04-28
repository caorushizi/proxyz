import pacScript from "bundle-text:./pac";

import { emitter, info } from "./utils";
import { Profile, ProxyMode } from "../helper/constant";

async function setProxy(profile: Profile<ProxyMode.Proxy>) {
  const { options } = profile;
  const {
    type,
    singleProxy,
    proxyForFtp,
    proxyForHttp,
    proxyForHttps,
    bypassList,
  } = options;
  const config: any = {
    mode: "fixed_servers",
    rules: {},
  };
  if (type === "basic") {
    config.rules = {
      singleProxy,
    };
  } else {
    config.rules = {
      proxyForHttp,
      proxyForHttps,
      proxyForFtp,
    };
  }
  if (bypassList) {
    config.rules.bypassList = bypassList.map((item) => item.pattern);
  }
  info("setProxy", config);
  await chrome.proxy.settings.set({ value: config, scope: "regular" });
}

async function setPAC() {
  const config = {
    mode: "pac_script",
    pacScript: {
      data: pacScript.replace(
        /globalThis.__REPLACE_HOST__/g,
        JSON.stringify([]),
      ),
      mandatory: true,
    },
  };
  info("setPAC", config);
  await chrome.proxy.settings.set({ value: config, scope: "regular" });
}

async function clearProxy() {
  await chrome.proxy.settings.clear({ scope: "regular" });
}

async function init() {
  emitter.on("changeProxy", async (profile) => {
    if (profile.type === ProxyMode.Proxy) {
      await setProxy(profile);
    } else if (profile.type === ProxyMode.PAC) {
      await setPAC();
    } else if (profile.type === ProxyMode.Auto) {
      await setPAC();
    } else if (profile.type === ProxyMode.Direct) {
      await clearProxy();
    } else if (profile.type === ProxyMode.System) {
      // await clearProxy();
    } else if (profile.type === ProxyMode.Virtual) {
      // await clearProxy();
    }
  });
  emitter.on("direct", async (direct) => {
    if (direct) {
      await clearProxy();
    }
  });
}

export default init;
