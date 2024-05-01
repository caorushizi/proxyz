export enum ProxyMode {
  Proxy = "proxy",
  Auto = "auto",
  PAC = "pac",
  Virtual = "virtual",
  Direct = "direct",
  System = "system",
}

const DEFAULT_PROXY_HOST = "example.com";
const DEFAULT_PROXY_PORT = 8888;

// =====
// 普通代理模式
// =====

export const initialSingleProxy: ProxyOption = {
  scheme: "http",
  host: DEFAULT_PROXY_HOST,
  port: DEFAULT_PROXY_PORT,
};
export const initialProxyForHttp: ProxyOption = {
  scheme: "http",
  host: DEFAULT_PROXY_HOST,
  port: DEFAULT_PROXY_PORT,
};
export const initialProxyForHttps: ProxyOption = {
  scheme: "http",
  host: DEFAULT_PROXY_HOST,
  port: DEFAULT_PROXY_PORT,
};
export const initialProxyForFtp: ProxyOption = {
  scheme: "http",
  host: DEFAULT_PROXY_HOST,
  port: DEFAULT_PROXY_PORT,
};

export const initialBypassList: BypassOption[] = [
  {
    condition: "BypassCondition",
    pattern: "127.0.0.1",
  },
  {
    condition: "BypassCondition",
    pattern: "[::1]",
  },
  {
    condition: "BypassCondition",
    pattern: "localhost",
  },
];

export interface ProxyOption {
  scheme: string;
  host: string;
  port: number;
}

export type BypassCondition = "BypassCondition";

export interface BypassOption {
  condition: BypassCondition;
  pattern: string;
}

export type ProxyType = "basic" | "advance";

export interface ProxyOptions {
  type: ProxyType;
  singleProxy?: ProxyOption;
  proxyForHttp?: ProxyOption;
  proxyForHttps?: ProxyOption;
  proxyForFtp?: ProxyOption;
  bypassList?: BypassOption[];
}

// =====

// auto

export type ConditionType =
  | "HostWildcardCondition"
  | "HostRegexCondition"
  | "UrlWildcardCondition"
  | "UrlRegexCondition"
  | "FalseCondition";

export interface AutoProxyRule {
  id: string;
  conditionType: ConditionType;
  pattern: string;
  profileId: number;
}

// direct
export const initialDirect: Profile<ProxyMode.Direct> = {
  id: -2,
  name: "[直接连接]",
  type: ProxyMode.Direct,
  color: "#aaa",
  options: [],
};

// system
export const initialSystem: Profile<ProxyMode.System> = {
  id: -1,
  name: "[系统代理]",
  type: ProxyMode.System,
  color: "#aaa",
  options: [],
};

export interface AutoProxyOptions {
  rules: AutoProxyRule[];
}

// pac
export interface PACOption {
  pacUrl: string;
  pacText: string;
}

export const initialPACText = `function FindProxyForURL(url, host) {\n\treturn "DIRECT";\n}\n`;

// 虚拟
export interface VirtualOption {
  profileId: number;
}

export type ProxyMap = {
  [ProxyMode.Proxy]: ProxyOptions;
  [ProxyMode.Auto]: AutoProxyOptions;
  [ProxyMode.PAC]: PACOption;
  [ProxyMode.Virtual]: VirtualOption;
  [ProxyMode.Direct]: [];
  [ProxyMode.System]: [];
};

export interface Profile<T extends ProxyMode = ProxyMode.Proxy> {
  id: number;
  name: string;
  type: T;
  color: string;
  options: ProxyMap[T];
}

export type ProfileType =
  | Profile<ProxyMode.Proxy>
  | Profile<ProxyMode.Auto>
  | Profile<ProxyMode.PAC>
  | Profile<ProxyMode.Virtual>
  | Profile<ProxyMode.Direct>
  | Profile<ProxyMode.System>;

export enum PopupPageType {
  PopupMenu = "PopupMenu",
  FailedToLoad = "FailedToLoad",
  AddConditions = "AddConditions",
}
