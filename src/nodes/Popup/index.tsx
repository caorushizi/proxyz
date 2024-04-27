import React from "react";
import { MenuProps, Menu } from "antd";
import { getMenuItem } from "../../helper";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ProxyIcon from "../../components/ProxyIcon";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { initProfiles, selectProfiles } from "../../store/profilesSlice";
import { useAsyncEffect } from "ahooks";

const Popup = () => {
  const [active, setActive] = React.useState<string>("");
  const profiles = useAppSelector(selectProfiles);
  const dispatch = useAppDispatch();

  const items: MenuProps["items"] = [
    getMenuItem("[直接连接]", "direct", <MailOutlined />),
    getMenuItem("[系统代理]", "system", <AppstoreOutlined />),
    { type: "divider" },
    ...profiles.map((profile) =>
      getMenuItem(
        profile.name,
        profile.id,
        <ProxyIcon type={profile.type} color={profile.color} />,
      ),
    ),
    { type: "divider" },
    getMenuItem("选项", "options", <SettingOutlined />),
  ];

  useAsyncEffect(async () => {
    await dispatch(initProfiles());
    const { active } = await chrome.storage.local.get("active");
    setActive(String(active));

    const [tab] = await chrome.tabs.query({
      active: true,
    });
    if (tab.id) {
      const response = await chrome.runtime.sendMessage({
        getRequest: tab.id,
      });
      console.log("response", response);
    }
  }, []);

  const onClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "direct") {
      setActive("direct");

      await chrome.storage.local.set({
        active: "direct",
      });

      await chrome.runtime.sendMessage({
        direct: true,
      });
    }

    const profile = profiles.find((profile) => profile.id === Number(key));
    if (!profile) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("未找到配置文件");
      }
      return;
    }

    setActive(profile.id.toString());

    await chrome.storage.local.set({
      active: profile.id,
    });

    chrome.runtime.sendMessage({ changeProxy: profile });
  };

  return (
    <>
      <Menu
        onClick={onClick}
        style={{ width: 230 }}
        items={items}
        activeKey={active}
      />
    </>
  );
};

export default Popup;
