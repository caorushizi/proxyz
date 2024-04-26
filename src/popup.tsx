import React from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import { MenuProps, Menu, ConfigProvider, theme } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import zhCN from "antd/locale/zh_CN";

const root = createRoot(document.getElementById("app")!);
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
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
const items: MenuProps["items"] = [
  getItem("[直接连接]", "sub1", <MailOutlined />),
  getItem("[系统代理]", "sub2", <AppstoreOutlined />),
  { type: "divider" },
  getItem("Fiddler", "sub4", <SettingOutlined />),
  getItem("Proxy", "sub4", <SettingOutlined />),
  getItem("auto", "sub4", <SettingOutlined />),
  { type: "divider" },
  getItem("选项", "sub4", <SettingOutlined />),
];

const App = () => {
  const onClick: MenuProps["onClick"] = () => {};
  return <Menu onClick={onClick} style={{ width: 230 }} items={items} />;
};

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: [theme.compactAlgorithm],
      }}
      locale={zhCN}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
