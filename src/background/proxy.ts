import pacScript from "bundle-text:./pac";
import { info } from "./utils";
import { Profile, ProfileType, ProxyMode } from "../helper/constant";
import { directColor, setIcon, systemColor } from "./icon";

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

async function setPAC(profile: Profile<ProxyMode.Auto>) {
  const { options } = profile;
  const { rules } = options;
  const rulesList = rules.map((rule) => rule.pattern);
  const config = {
    mode: "pac_script",
    pacScript: {
      data: pacScript.replace(
        /globalThis.__REPLACE_HOST__/g,
        JSON.stringify(rulesList),
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

export async function setDirect() {
  await setIcon(directColor);
  await clearProxy();
}

export async function setSystem() {
  await setIcon(systemColor);
  await clearProxy();
}

export async function setProfile(profile: ProfileType) {
  await setIcon(profile.color);
  if (profile.type === ProxyMode.Proxy) {
    await setProxy(profile);
  } else if (profile.type === ProxyMode.Auto) {
    await setPAC(profile);
  }
}

async function init() {}

export default init;
