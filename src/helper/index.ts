export { ProxyMode } from "./constant";
import type { MenuProps } from "antd";

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

export function generateUnlimitedMacaronColor() {
  function getRandomColorComponent() {
    return Math.floor(Math.random() * 256);
  }

  const red = getRandomColorComponent();
  const green = getRandomColorComponent();
  const blue = getRandomColorComponent();

  return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}
