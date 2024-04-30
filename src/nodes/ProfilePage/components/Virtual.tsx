import { DownOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, MenuProps, Space, message } from "antd";
import React from "react";
import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "3rd menu item",
    key: "3",
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: "4rd menu item",
    key: "4",
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];

const handleMenuClick: MenuProps["onClick"] = () => {
  message.info("Click on menu item.");
};

const menuProps = {
  items,
  onClick: handleMenuClick,
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const Virtual = () => {
  const [form] = Form.useForm<{ name: string; company: string }>();

  return (
    <Form
      name="basic"
      initialValues={{}}
      autoComplete="off"
      onChange={() => {}}
      layout="vertical"
    >
      <Form.Item<FieldType>
        label="虚拟情景模式"
        name="username"
        tooltip="当使用此情景模式时，相当于使用了以下情景模式："
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        目标
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              Button
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Form.Item>

      <Form.Item<FieldType>
        label="PAC 脚本"
        rules={[{ required: true, message: "Please input your password!" }]}
        name="password"
        tooltip="通过此功能可以更改现有的选项，使用此虚情景模式来取代 。此功能会把所有和 相关的切换规则改为使用此虚情景模式。这样一来，就可以通过此虚情景模式来控制那些切换条件对应的结果。"
      >
        <ModalForm<{
          name: string;
          company: string;
        }>
          title="新建表单"
          trigger={
            <Button type="primary">
              <PlusOutlined />
              新建表单
            </Button>
          }
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {},
          }}
          submitTimeout={2000}
          onFinish={async () => {
            await waitTime(2000);
            message.success("提交成功");
            return true;
          }}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="name"
              label="签约客户名称"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
            />

            <ProFormText
              width="md"
              name="company"
              label="我方公司名称"
              placeholder="请输入名称"
            />
          </ProForm.Group>
        </ModalForm>
      </Form.Item>
    </Form>
  );
};

export default Virtual;
