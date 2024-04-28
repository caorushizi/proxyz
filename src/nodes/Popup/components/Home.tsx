import { Menu, MenuProps } from "antd";
import React, { FC } from "react";
import {
  AppstoreOutlined,
  FilterFilled,
  MailOutlined,
  PlusOutlined,
  SettingOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { ProxyMode, getMenuItem } from "../../../helper";
import ProxyIcon from "../../../components/ProxyIcon";
import {
  PageType,
  setMenuItem,
  setPage,
  useHomeState,
  useHomeStateDispatch,
} from "../HomeContext";

const Home: FC = () => {
  const { active, profiles, urls, domain } = useHomeState();
  const dispatch = useHomeStateDispatch();
  const activeProfile = profiles.find(
    (profile) => profile.id === Number(active),
  );

  const renderItems = () => {
    const items: MenuProps["items"] = [
      getMenuItem("[直接连接]", "direct", <MailOutlined />),
      getMenuItem("[系统代理]", "system", <AppstoreOutlined />),
    ];

    if (urls.length) {
      items.push(
        { type: "divider" },
        getMenuItem(`${urls.length} 个资源未加载`, "unload", <WarningFilled />),
      );
    }

    items.push(
      { type: "divider" },
      ...profiles.map((profile) =>
        getMenuItem(
          profile.name,
          profile.id,
          <ProxyIcon type={profile.type} color={profile.color} />,
        ),
      ),
    );

    if (
      activeProfile?.type === ProxyMode.Auto ||
      (activeProfile?.type &&
        [
          ProxyMode.Auto,
          ProxyMode.Proxy,
          ProxyMode.Direct,
          ProxyMode.PAC,
          ProxyMode.Virtual,
        ].includes(activeProfile?.type) &&
        domain)
    ) {
      items.push({ type: "divider" });
    }

    if (activeProfile?.type === ProxyMode.Auto) {
      items.push(getMenuItem("添加条件", "add", <PlusOutlined />));
    }

    if (
      activeProfile?.type &&
      [
        ProxyMode.Auto,
        ProxyMode.Proxy,
        ProxyMode.Direct,
        ProxyMode.PAC,
        ProxyMode.Virtual,
      ].includes(activeProfile?.type) &&
      domain
    ) {
      items.push(
        getMenuItem(domain, "current", <FilterFilled />, [
          ...profiles.map((profile) =>
            getMenuItem(
              profile.name,
              profile.id + "_add",
              <ProxyIcon type={profile.type} color={profile.color} />,
            ),
          ),
        ]),
      );
    }

    items.push(
      { type: "divider" },
      getMenuItem("选项", "options", <SettingOutlined />),
    );
    return items;
  };

  const onClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "options") {
      chrome.runtime.openOptionsPage();
      return;
    }
    if (key === "add") {
      dispatch(setPage(PageType.Add));
      return;
    }
    if (key === "direct" || key === "system") {
      dispatch(setMenuItem(key));

      await chrome.storage.local.set({
        active: key,
      });

      await chrome.runtime.sendMessage({
        direct: true,
      });
      return;
    }
    if (key === "unload") {
      dispatch(setPage(PageType.Unload));
      return;
    }

    const profile = profiles.find((profile) => profile.id === Number(key));
    if (profile) {
      dispatch(setMenuItem(profile.id.toString()));
      await chrome.storage.local.set({
        active: profile.id,
      });
    } else {
      chrome.runtime.sendMessage({ changeProxy: profile });
      if (process.env.NODE_ENV !== "production") {
        console.warn("未找到配置文件");
      }
    }
  };
  return (
    <Menu
      onClick={onClick}
      style={{ width: 230 }}
      items={renderItems()}
      selectedKeys={[active]}
      mode="inline"
    />
  );
};

export default Home;
