export { ProxyMode } from "./constant";
import type { MenuProps } from "antd";
import { BypassOption } from "./constant";

type MenuItem = Required<MenuProps>["items"][number];

export function getMenuItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export function getMacaronColor(len?: number): string {
  const colors = [
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
  if (/^https?:\/\//.test(url)) {
    const urlObj = new URL(url);
    return urlObj.hostname;
  }
  return null;
}
