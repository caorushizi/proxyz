export enum ProxyMode {
  Proxy = "proxy",
  Auto = "auto",
  PAC = "pac",
  Virtual = "virtual",
  Direct = "direct",
  System = "system",
}

export const basicForm: ProxyOption[] = [
  {
    id: 1,
    origin: "all",
    protocol: "direct",
    host: "example.com",
    port: 8888,
  },
];

export interface ProxyOption {
  id: number;
  origin: string;
  protocol: string;
  host: string;
  port: number;
}

export type ProxyType = "basic" | "advance";

export interface ProxyOptions {
  type: ProxyType;
  rules: ProxyOption[];
}

export type ProxyMap = {
  [ProxyMode.Proxy]: ProxyOptions;
  [ProxyMode.Auto]: ProxyOption[];
  [ProxyMode.PAC]: ProxyOption[];
  [ProxyMode.Virtual]: ProxyOption[];
  [ProxyMode.Direct]: ProxyOption[];
  [ProxyMode.System]: ProxyOption[];
};

export interface Profile<T extends ProxyMode = ProxyMode.Proxy> {
  id: number;
  name: string;
  type: T;
  color: string;
  options: ProxyMap[T];
}
