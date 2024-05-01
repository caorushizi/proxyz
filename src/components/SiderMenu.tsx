import {
  Button,
  Flex,
  Form,
  Menu,
  MenuProps,
  Space,
  Typography,
  message,
} from "antd";
import { createStyles, css } from "antd-style";
import React, { useEffect } from "react";
import { ProxyMode, getMacaronColor } from "../helper";
import { Link, useLocation } from "react-router-dom";
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
} from "@ant-design/pro-components";
import {
  SettingOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import ProxyIcon from "./ProxyIcon";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addProfileAction, selectProfiles } from "../store/profilesSlice";
import {
  Profile,
  ProfileType,
  initialBypassList,
  initialDirect,
  initialPACText,
  initialSingleProxy,
} from "../helper/constant";

const { Text } = Typography;

const useStyle = createStyles({
  menu: css`
    overflow: auto;
    flex: 1;
    border-inline-end: none !important;
  `,
  radioWrapper: css`
    display: flex;
    flex-direction: column;
    align-items: start;
  `,
  radioTitle: css`
    display: flex;
    align-items: center;
  `,
  radioDesc: css`
    margin-top: 8px;
    color: #bfbfbf;
  `,
});

function getLastProfileId(profiles: ProfileType[]): number {
  return profiles.length > 0 ? profiles[profiles.length - 1].id : 0;
}

const SiderMenu: React.FC = () => {
  const [form] = Form.useForm<Pick<ProfileType, "name" | "type">>();
  const [messageApi, contextHolder] = message.useMessage();
  const { styles } = useStyle();
  const [selectedKey, setSelectedKey] = React.useState<string[]>();
  const profiles = useAppSelector(selectProfiles);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/profile\/(\d+)/);
    if (match) {
      setSelectedKey([match[1]]);
    } else {
      setSelectedKey([path]);
    }
  }, [location.pathname]);

  const renderDesc = (icon: React.ReactNode, title: string, desc: string) => {
    return (
      <div className={styles.radioWrapper}>
        <Space className={styles.radioTitle}>
          {icon}
          <Text>{title}</Text>
        </Space>
        <Text type="secondary">{desc}</Text>
      </div>
    );
  };

  const renderAddForm = () => {
    return (
      <ModalForm<Pick<ProfileType, "name" | "type">>
        title="新建情景模式"
        trigger={
          <Button size="small" type="text" icon={<PlusOutlined />}></Button>
        }
        form={form}
        autoFocusFirstInput
        className="new-options-form-radio"
        initialValues={{ name: "", type: ProxyMode.Proxy }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {},
        }}
        submitTimeout={2000}
        onFinish={async (profile) => {
          const lastId = getLastProfileId(profiles);
          const color = getMacaronColor(lastId + 1);
          if (profile.type === ProxyMode.Proxy) {
            const item: Omit<Profile<ProxyMode.Proxy>, "id"> = {
              name: profile.name,
              type: profile.type,
              color,
              options: {
                type: "basic",
                singleProxy: initialSingleProxy,
                bypassList: initialBypassList,
              },
            };
            dispatch(addProfileAction(item));
          } else if (profile.type === ProxyMode.Auto) {
            const item: Omit<Profile<ProxyMode.Auto>, "id"> = {
              name: profile.name,
              type: profile.type,
              color,
              options: {
                rules: [],
              },
            };
            dispatch(addProfileAction(item));
          } else if (profile.type === ProxyMode.PAC) {
            // FIXME: 完成 PAC 和 Virtual 的添加
            const item: Omit<Profile<ProxyMode.PAC>, "id"> = {
              name: profile.name,
              type: profile.type,
              color,
              options: {
                pacUrl: "",
                pacText: initialPACText,
              },
            };
            dispatch(addProfileAction(item));
          } else if (profile.type === ProxyMode.Virtual) {
            const item: Omit<Profile<ProxyMode.Virtual>, "id"> = {
              name: profile.name,
              type: profile.type,
              color,
              options: {
                profileId: initialDirect.id,
              },
            };
            dispatch(addProfileAction(item));
          }
          messageApi.success("添加成功");
          return true;
        }}
        layout="vertical"
      >
        <ProFormText
          name="name"
          label="情景模式名称"
          placeholder="请输入情景模式名称"
          required
          rules={[
            {
              required: true,
              message: "请输入情景模式名称，最长 24 位",
              max: 24,
            },
          ]}
          fieldProps={{
            maxLength: 24,
          }}
        />
        <ProFormRadio.Group
          name="type"
          label="请选择情景模式的类型"
          layout="vertical"
          required
          options={[
            {
              label: renderDesc(
                <ProxyIcon type={ProxyMode.Proxy} />,
                "代理服务器",
                "经过代理服务器访问网站。",
              ),
              value: ProxyMode.Proxy,
            },
            {
              label: renderDesc(
                <ProxyIcon type={ProxyMode.Auto} />,
                "自动切换模式",
                "根据多种条件，如域名或网址等自动选择情景模式。您也可以导入在线发布的切换规则（如 AutoProxy 列表）以简化设置。",
              ),
              value: ProxyMode.Auto,
            },
            {
              label: renderDesc(
                <ProxyIcon type={ProxyMode.PAC} />,
                "PAC情景模式",
                `根据在线或本地的PAC脚本选择代理。
        如果您没有任何PAC脚本，也没有脚本的网址，则不必使用此情景模式。不了解PAC的用户不建议自行尝试编写脚本。`,
              ),
              value: ProxyMode.PAC,
            },
            {
              label: renderDesc(
                <ProxyIcon type={ProxyMode.Virtual} />,
                "虚情景模式",
                "虚情景模式可以作为某个其他情景模式使用，并可以根据需要更改对象。一般用在自动切换中，这样就可以一次性更改多个条件对应的代理。",
              ),
              value: ProxyMode.Virtual,
            },
          ]}
        />
      </ModalForm>
    );
  };

  const renderMenuItem = (): MenuProps["items"] => {
    if (!profiles.length) {
      return [
        {
          label: <Text type="secondary">暂无情景模式</Text>,
          key: "no-profile",
          disabled: true,
        },
      ];
    }
    return profiles.map((profile) => ({
      label: <Link to={`profile/${profile.id}`}>{profile.name}</Link>,
      key: profile.id,
      icon: <ProxyIcon type={profile.type} color={profile.color} />,
    }));
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <Flex align="center" justify="space-between">
          情景模式
          {renderAddForm()}
        </Flex>
      ),
      key: "profile-group",
      children: renderMenuItem(),
      type: "group",
    },
    { type: "divider" },
    {
      label: "设置",
      key: "setting-group",
      children: [
        {
          label: <Link to={"/settings"}>设置</Link>,
          key: "/settings",
          icon: <SettingOutlined />,
        },
        {
          label: <Link to={"/"}>关于</Link>,
          key: "/",
          icon: <InfoCircleOutlined />,
        },
      ],
      type: "group",
    },
  ];
  return (
    <>
      {contextHolder}
      <Menu
        className={styles.menu}
        selectedKeys={selectedKey}
        mode="inline"
        items={items}
      />
    </>
  );
};

export default SiderMenu;
