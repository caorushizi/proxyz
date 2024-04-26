import React, { useState } from "react";
import {
  EditableProTable,
  ProColumns,
  ProForm,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, Space, Typography } from "antd";
import { createStyles, css } from "antd-style";

const { Title, Text } = Typography;

const initialText = `127.0.0.1
[::1]
localhost`;

const useStyle = createStyles({
  formWrapper: css`
    padding: 16px 24px;
  `,
});

type DataSourceType = {
  id: React.Key;
  name?: string;
  protocol?: string;
  ip?: string;
  port?: number;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 1,
    name: "（默认）",
    ip: "0.0.0.0",
    protocol: "direct",
    port: 8888,
    children: [
      {
        id: 2,
        name: "http",
        ip: "0.0.0.0",
        protocol: "direct",
        port: 8888,
      },
      {
        id: 3,
        name: "https",
        ip: "0.0.0.0",
        protocol: "direct",
        port: 8888,
      },
      {
        id: 4,
        name: "ftp",
        ip: "0.0.0.0",
        protocol: "direct",
        port: 8888,
      },
    ],
  },
];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: "网址协议",
    dataIndex: "name",
    editable: false,
  },
  {
    title: "代理协议",
    key: "state",
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
  {
    title: "代理服务器",
    dataIndex: "ip",
    valueType: "text",
  },
  {
    title: "代理端口",
    dataIndex: "port",
    valueType: "digit",
  },
  {
    title: "操作",
    valueType: "option",
    render: () => [
      <a key="delete" onClick={() => {}}>
        删除
      </a>,
    ],
  },
];

const Proxy = () => {
  const { styles } = useStyle();
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(
    () => defaultData,
  );

  return (
    <div>
      <EditableProTable<DataSourceType>
        headerTitle={<Title level={4}>代理服务器</Title>}
        columns={columns}
        rowKey="id"
        scroll={{
          x: 960,
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
