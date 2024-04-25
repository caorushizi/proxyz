import {
  App,
  Button,
  Flex,
  Form,
  Menu,
  MenuProps,
  Space,
  Typography,
} from "antd";
import { createStyles, css } from "antd-style";
import React from "react";
import { ProxyMode, getMenuItem } from "../helper";
import { Link } from "react-router-dom";
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
} from "@ant-design/pro-components";
import {
  ToolOutlined,
  SettingOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { ProfileList } from "../store/ProfileList";
import ProxyIcon from "./ProxyIcon";

const { Text } = Typography;

interface FormValues {
  name: string;
  proxy: ProxyMode;
}

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

interface OptionsProps {
  profileList: ProfileList;
}

const SiderMenu: React.FC<OptionsProps> = ({ profileList }) => {
  const [form] = Form.useForm<FormValues>();
  const { message } = App.useApp();
  const { styles } = useStyle();

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
      <ModalForm<FormValues>
        title="新建情景模式"
        trigger={
          <Button size="small" type="text" icon={<PlusOutlined />}></Button>
        }
        form={form}
        autoFocusFirstInput
        className="new-options-form-radio"
        initialValues={{ name: "", proxy: ProxyMode.Proxy }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log("run"),
        }}
        submitTimeout={2000}
        onFinish={async (profile) => {
          await profileList.addProfile(profile.name, profile.proxy);
          message.success("添加成功");
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
          name="proxy"
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
                <ProxyIcon type={ProxyMode.AutoProxy} />,
                "自动切换模式",
                "根据多种条件，如域名或网址等自动选择情景模式。您也可以导入在线发布的切换规则（如 AutoProxy 列表）以简化设置。",
              ),
              value: ProxyMode.AutoProxy,
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

  const items: MenuProps["items"] = [
    getMenuItem(
      "设定",
      "setting",
      null,
      [
        getMenuItem(<Link to={"/"}>界面</Link>, "tool", <ToolOutlined />),
        getMenuItem(
          <Link to={"/general"}>通用</Link>,
          "setting",
          <SettingOutlined />,
        ),
        getMenuItem(
          <Link to={"export"}>导入/导出</Link>,
          "export",
          <SaveOutlined />,
        ),
      ],
      "group",
    ),
    { type: "divider" },

    getMenuItem(
      <Flex align="center" justify="space-between">
        情景模式
        {renderAddForm()}
      </Flex>,
      "mode",
      null,
      profileList.profiles.map((profile) =>
        getMenuItem(
          <Link to={`profile/${profile.id}`}>{profile.name}</Link>,
          profile.id,
          <ProxyIcon type={profile.type} />,
        ),
      ),
      "group",
    ),
  ];
  return (
    <Menu
      className={styles.menu}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};

export default observer(SiderMenu);