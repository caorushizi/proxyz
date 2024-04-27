import React, { FC, useEffect, useState } from "react";
import {
  EditableProTable,
  ProColumns,
  ProForm,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, Radio, RadioChangeEvent, Space, Typography } from "antd";
import { createStyles, css } from "antd-style";
import {
  Profile,
  ProxyMode,
  ProxyOption,
  ProxyType,
  basicForm,
} from "../../../helper/constant";
import { useAppDispatch } from "../../../hooks";
import { updateProfile } from "../../../store/profilesSlice";

const { Title, Text } = Typography;

const initialText = `127.0.0.1
[::1]
localhost`;

const useStyle = createStyles({
  formWrapper: css`
    padding: 16px 24px;
  `,
});

const advanceForm: ProxyOption[] = [
  {
    id: 2,
    origin: "http",
    protocol: "direct",
    host: "example.com",
    port: 8888,
  },
  {
    id: 3,
    origin: "https",
    protocol: "direct",
    host: "example.com",
    port: 8888,
  },
  {
    id: 4,
    origin: "ftp",
    protocol: "direct",
    host: "example.com",
    port: 8888,
  },
];

const columnsMap: Record<string, ProColumns<ProxyOption>> = {
  origin: {
    title: "网址协议",
    dataIndex: "origin",
    editable: false,
  },
  protocol: {
    title: "代理协议",
    dataIndex: "protocol",
    valueType: "select",
    valueEnum: {
      direct: { text: "直接连接", status: "direct" },
      http: { text: "HTTP", status: "http" },
      https: { text: "HTTPS", status: "https" },
      sock4: { text: "SOCK4", status: "sock4" },
      sock5: { text: "SOCK5", status: "sock5" },
    },
    fieldProps: {
      allowClear: false,
    },
  },
  host: {
    title: "代理服务器",
    dataIndex: "host",
    valueType: "text",
  },
  port: {
    title: "代理端口",
    dataIndex: "port",
    valueType: "digit",
  },
  option: {
    title: "操作",
    valueType: "option",
    render: () => [
      <a key="delete" onClick={() => {}}>
        删除
      </a>,
    ],
  },
};
const basicColumns = ["protocol", "host", "port", "option"].map(
  (col) => columnsMap[col],
);
const advanceColumns = ["origin", "protocol", "host", "port", "option"].map(
  (col) => columnsMap[col],
);

const optionsWithDisabled = [
  { label: "基础", value: "basic" },
  { label: "高级", value: "advance" },
];

interface ProxyProps {
  profile: Profile<ProxyMode.Proxy>;
}

const Proxy: FC<ProxyProps> = ({ profile }) => {
  const { styles } = useStyle();
  const [value2, setValue2] = useState<ProxyType>("basic");
  const [columns, setColumns] =
    useState<ProColumns<ProxyOption>[]>(basicColumns);
  const [dataSource, setDataSource] =
    useState<readonly ProxyOption[]>(basicForm);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { options } = profile;
    if (options.type === "basic") {
      setValue2("basic");
      const basic = options.rules[0];
      if (basic) {
        setDataSource([
          {
            id: 1,
            origin: "all",
            protocol: basic.protocol,
            host: basic.host,
            port: basic.port,
          },
        ]);
      } else {
        setDataSource(basicForm);
      }
      setColumns(basicColumns);
    }
  }, []);

  const onChange2 = ({ target: { value } }: RadioChangeEvent) => {
    setValue2(value);
    if (value === "basic") {
      setDataSource(basicForm);
      setColumns(basicColumns);
    } else {
      setDataSource(advanceForm);
      setColumns(advanceColumns);
    }
  };

  return (
    <div>
      <EditableProTable<ProxyOption>
        headerTitle={
          <Title level={4}>
            代理服务器
            <Radio.Group
              options={optionsWithDisabled}
              onChange={onChange2}
              value={value2}
            />
          </Title>
        }
        columns={columns}
        rowKey="id"
        scroll={{
          x: 800,
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={false}
        editable={{
          type: "multiple",
          editableKeys: [1, 2, 3, 4],
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            dispatch(
              updateProfile({
                ...profile,
                options: { type: value2, rules: recordList },
              }),
            );
            setDataSource(recordList);
          },
        }}
      />
      <div className={styles.formWrapper}>
        <Title level={4}>不代理的地址列表</Title>
        <ProForm>
          <ProForm.Item>
            <Space direction="vertical">
              <Text>不经过代理连接的主机列表: (每行一个主机)</Text>
              <Button type="link">(可使用通配符等匹配规则…)</Button>
            </Space>
          </ProForm.Item>
          <ProFormTextArea initialValue={initialText} />
        </ProForm>
      </div>
    </div>
  );
};

export default Proxy;
