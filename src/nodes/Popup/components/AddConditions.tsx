import { Button, Form, Input, Select, Tag, Typography } from "antd";
import { createStyles, css } from "antd-style";
import React from "react";
import PopupCard from "../../../components/PopupCard";
import SelectItem from "../../../components/SelectItem";
import { ProxyMode, initialDirect } from "../../../helper/constant";
import localforage from "localforage";
import { useAsyncEffect } from "ahooks";
import { useSelector } from "react-redux";
import {
  selectActiveProfile,
  selectPopupState,
} from "../../../store/popupSlice";
import { selectProfiles } from "../../../store/profilesSlice";
import { getWildcard } from "../../../helper";

const { Option } = Select;
const { Text } = Typography;

const useStyle = createStyles({
  title: css`
    margin-left: 5px;
    font-size: 16px;
    font-weight: 600;
  `,
  titleTag: css`
    margin-left: 10px;
  `,
});

interface FormValues {
  conditionType: string;
  pattern: string;
  profileId: number;
}

const AddConditions = () => {
  const { styles } = useStyle();
  const { currUrl } = useSelector(selectPopupState);
  const profiles = useSelector(selectProfiles);
  const activeProfile = useSelector(selectActiveProfile);
  const [form] = Form.useForm<FormValues>();

  const onSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    await localforage.setItem("lastProfileId", values.profileId);
  };

  useAsyncEffect(async () => {
    const lastProfileId = await localforage.getItem<number>("lastProfileId");
    const lastProfile = profiles.find((i) => i.id === lastProfileId);
    if (lastProfileId && lastProfile) {
      form.setFieldsValue({
        profileId: lastProfileId,
        pattern: getWildcard(currUrl),
      });
    }
  }, []);

  return (
    <PopupCard
      header={
        <Text className={styles.title}>
          添加条件到情景模式
          {activeProfile && (
            <Tag className={styles.titleTag}>
              <SelectItem profile={activeProfile} />
            </Tag>
          )}
        </Text>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          conditionType: "HostWildcardCondition",
          pattern: currUrl,
          profileId: initialDirect.id,
        }}
      >
        <Form.Item
          label="条件类型"
          name="conditionType"
          required
          rules={[
            {
              required: true,
              message: "请选择条件类型",
            },
          ]}
        >
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
          name="pattern"
          rules={[
            {
              required: true,
              message: "请选择条件类型",
            },
          ]}
        >
          <Input placeholder="请输入条件设置" />
        </Form.Item>
        <Form.Item
          label="情景模式"
          name="profileId"
          required
          rules={[
            {
              required: true,
              message: "请选择条件类型",
            },
          ]}
        >
          <Select placeholder="请选择情景模式">
            {[...profiles, initialDirect]
              .filter((profile) => profile.type !== ProxyMode.Auto)
              .map((profile) => (
                <Option key={profile.id} value={profile.id}>
                  <SelectItem profile={profile} />
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" onClick={onSubmit}>
            添加条件
          </Button>
        </Form.Item>
      </Form>
    </PopupCard>
  );
};

export default AddConditions;
