import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Select, Typography } from "antd";
import { createStyles, css } from "antd-style";
import React, { useState } from "react";
import { useHomeState } from "../HomeContext";
import ProxyIcon from "../../../components/ProxyIcon";
import { ProxyMode } from "../../../helper";
import PopupCard from "../../../components/PopupCard";

const { Option } = Select;
const { Text } = Typography;

const useStyle = createStyles({
  title: css`
    margin-left: 5px;
    font-size: 16px;
    font-weight: 600;
  `,
});

type RequiredMark = boolean | "optional" | "customize";

const Add = () => {
  const { styles } = useStyle();
  const { profiles } = useHomeState();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] =
    useState<RequiredMark>("optional");

  const onRequiredTypeChange = ({
    requiredMarkValue,
  }: {
    requiredMarkValue: RequiredMark;
  }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  return (
    <PopupCard
      header={<Text className={styles.title}>添加条件到情景模式</Text>}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ requiredMarkValue: requiredMark }}
        onValuesChange={onRequiredTypeChange}
      >
        <Form.Item label="条件类型" name="conditionType" required>
          <Select placeholder="请选择条件类型">
            <Option value="HostWildcardCondition">域名通配符</Option>
            <Option value="UrlWildcardCondition">网址通配符</Option>
            <Option value="UrlRegexCondition">网址正则</Option>
            <Option value="FalseCondition">（禁用）</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="条件设置"
          required
          tooltip="This is a required field"
          name="pattern"
        >
          <Input placeholder="请输入条件设置" />
        </Form.Item>
        <Form.Item
          label="情景模式"
          tooltip={{
            title: "Tooltip with customize icon",
            icon: <InfoCircleOutlined />,
          }}
          name="profileName"
          required
        >
          <Select placeholder="请选择情景模式">
            {profiles.map((profile) => (
              <Option key={profile.id} value={profile.id}>
                <ProxyIcon type={profile.type} color={profile.color} />
                {profile.name}
              </Option>
            ))}
            <Option key="direct" value="direct">
              <ProxyIcon type={ProxyMode.Direct}></ProxyIcon>
              [直接连接]
            </Option>
          </Select>
        </Form.Item>
        <Flex justify="space-between">
          <Button>取消</Button>
          <Button type="primary">添加条件</Button>
        </Flex>
      </Form>
    </PopupCard>
  );
};

export default Add;
