export enum ProxyMode {
  Proxy = "proxy",
  Auto = "auto",
  PAC = "pac",
  Virtual = "virtual",
  Direct = "direct",
}

export interface Profile {
  id: number;
  name: string;
  type: ProxyMode;
  color: string;
}
