import pacScript from "bundle-text:./pac";

import { emitter } from "./utils";
import { Profile, ProxyMode } from "../helper/constant";

async function setProxy(profile: Profile<ProxyMode.Proxy>) {
  const { options } = profile;
  const { type, rules } = options;
  const config = {
    mode: "fixed_servers",
    rules: {},
  };
  if (type === "basic") {
    config.rules = {
      singleProxy: {
        scheme: rules[0].protocol,
        host: rules[0].host,
        port: rules[0].port,
      },
    };
  }
  await chrome.proxy.settings.set({ value: config, scope: "regular" });
}

async function setPAC() {
  const config = {
    mode: "pac_script",
    pacScript: {
      data: pacScript,
      mandatory: true,
    },
  };
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
