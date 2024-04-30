import { Menu, MenuProps, message } from "antd";
import React, { FC } from "react";
import {
  FilterOutlined,
  PlusOutlined,
  SettingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { ProxyMode, getWildcard } from "../../../helper";
import ProxyIcon from "../../../components/ProxyIcon";
import {
  PopupPageType,
  initialDirect,
  initialSystem,
} from "../../../helper/constant";
import { useSelector } from "react-redux";
import {
  selectActiveProfile,
  selectPopupState,
  setPage,
} from "../../../store/popupSlice";
import { useAppDispatch } from "../../../hooks";
import { selectProfiles } from "../../../store/profilesSlice";
import useChrome from "../../../hooks/chrome";

const PopupMenu: FC = () => {
  const dispatch = useAppDispatch();
  const { activeId, resources, currUrl } = useSelector(selectPopupState);
  const profiles = useSelector(selectProfiles);
  const activeProfile = useSelector(selectActiveProfile);
  const { setDirect, setSystem, setProfile } = useChrome();
  const [messageApi, contextHolder] = message.useMessage();

  const renderItems = () => {
    const items: MenuProps["items"] = [
      {
        label: initialDirect.name,
        key: initialDirect.id,
        icon: <ProxyIcon type={initialDirect.type} />,
        onClick: async () => {
          try {
            await setDirect(initialDirect.id);
            window.close();
          } catch (e: any) {
            messageApi.error(e.message);
          }
        },
      },
      {
        label: initialSystem.name,
        key: initialSystem.id,
        icon: <ProxyIcon type={initialSystem.type} />,
        onClick: async () => {
          try {
            await setSystem(initialSystem.id);
            window.close();
          } catch (e: any) {
            messageApi.error(e.message);
          }
        },
      },
    ];

    items.push(
      ...profiles.map((profile) => ({
        label: profile.name,
        key: `${profile.id}`,
        icon: <ProxyIcon type={profile.type} color={profile.color} />,
        onClick: async () => {
          try {
            await setProfile(profile);
            window.close();
          } catch (e: any) {
            messageApi.error(e.message);
          }
        },
      })),
    );

    const options = [];
    if (resources.length) {
      options.push({
        label: `${resources.length} 个资源未加载`,
        key: "failtoload",
        icon: <WarningOutlined />,
        onClick() {
          dispatch(setPage(PopupPageType.FailedToLoad));
        },
      });
    }

    if (activeProfile?.type === ProxyMode.Auto) {
      options.push({
        label: "添加规则",
        key: "add",
        icon: <PlusOutlined />,
        onClick() {
          dispatch(setPage(PopupPageType.AddConditions));
        },
      });
    }

    if (activeProfile?.type !== ProxyMode.System && currUrl) {
      options.push({
        label: getWildcard(currUrl),
        key: "current",
        icon: <FilterOutlined />,
        children: profiles.map((profile) => ({
          label: profile.name,
          key: profile.id + "_add",
          icon: <ProxyIcon type={profile.type} color={profile.color} />,
        })),
      });
    }
    if (options.length) {
      items.push({ type: "divider" }, ...options);
    }

    items.push(
      { type: "divider" },
      {
        label: "选项",
        key: "options",
        icon: <SettingOutlined />,
        onClick: () => {
          chrome.runtime.openOptionsPage();
        },
      },
    );
    return items;
  };

  return (
    <>
      {contextHolder}
      <Menu
        style={{ width: 230 }}
        items={renderItems()}
        selectedKeys={[String(activeId)]}
        mode="inline"
      />
    </>
  );
};

export default PopupMenu;
