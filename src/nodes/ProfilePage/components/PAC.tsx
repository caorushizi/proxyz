import { Button, Form, Input, Space, message } from "antd";
import React, { FC, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { ProForm } from "@ant-design/pro-components";
import { Profile, ProxyMode } from "../../../helper/constant";
import { useAppDispatch } from "../../../hooks";
import { updateProfileAction } from "../../../store/profilesSlice";
import { produce } from "immer";
import MonacoEditor from "react-monaco-editor";

type PACForm = {
  pacUrl?: string;
  pacText?: string;
};

const fetchPAC = async (url: string) => {
  const resp = await fetch(url);
  const text = await resp.text();
  return text;
};

interface PACProps {
  profile: Profile<ProxyMode.PAC>;
}

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
}
const EditorWrapper: FC<EditorProps> = ({
  value = "",
  onChange = () => {},
}) => {
  return (
    <MonacoEditor
      height="500"
      theme="vs-dark"
      value={value}
      onChange={onChange}
    />
  );
};

interface TextProps {
  value?: string;
  onChange?: (value: string) => void;
  onFetch: (url: string) => Promise<void>;
  loading: boolean;
}
const TextWrapper: FC<TextProps> = ({
  value = "",
  onChange = () => {},
  onFetch,
  loading,
}) => {
  return (
    <Space.Compact block>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        loading={loading}
        onClick={() => onFetch(value || "")}
      >
        更新 PAC 脚本
      </Button>
    </Space.Compact>
  );
};

const PAC: FC<PACProps> = ({ profile }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <ProForm<PACForm>
      form={form}
      initialValues={profile.options}
      onFinish={() => {
        const value = form.getFieldsValue();
        const nextState = produce(profile, (draft) => {
          draft.options = value;
        });
        dispatch(updateProfileAction(nextState));
      }}
    >
      {contextHolder}
      <ProForm.Item name="pacUrl" label="PAC 网址">
        <TextWrapper
          loading={loading}
          onFetch={async (url: string) => {
            try {
              setLoading(true);
              const text = await fetchPAC(url);
              form.setFieldValue("pacText", text);
            } catch (e: any) {
              messageApi.error(e.message);
            }
            setLoading(false);
          }}
        />
      </ProForm.Item>
      <ProForm.Item name="pacText" label="PAC 网址">
        <EditorWrapper />
      </ProForm.Item>
    </ProForm>
  );
};

export default PAC;
