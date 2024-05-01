export { ProxyMode } from "./constant";
import { BypassOption } from "./constant";
import { getDomain } from "tldjs";

export function getMacaronColor(len?: number): string {
  const colors = [
    "#99ccee",
    "#99dd99",
    "#ffaa88",
    "#ffee99",
    "#d497ee",
    "#E74F4C",
    "#ed9745",
    "#E04C31",
    "#7BD144",
    "#4CCBCD",
    "#4669EA",
    "#E855A4",
  ];
  if (len) {
    return colors[len % colors.length];
  }
  return colors[Math.floor(Math.random() * colors.length)];
}

export function parseBypassList(text: string): BypassOption[] {
  return text.split("\n").map((pattern: string) => ({
    condition: "BypassCondition",
    pattern,
  }));
}

export function formatBypassList(bypassList: BypassOption[]): string {
  return bypassList.map((item) => item.pattern).join("\n");
}

// TODO: 获取泛域名
export function getWildcard(url: string) {
  return `*.${getDomain(url)}`;
}
