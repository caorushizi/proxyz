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
  BypassOption,
  Profile,
  ProxyMode,
  ProxyOption,
  ProxyOptions,
  ProxyType,
  initialBypassList,
  initialProxyForFtp,
  initialProxyForHttp,
  initialProxyForHttps,
  initialSingleProxy,
} from "../../../helper/constant";
import { useAppDispatch } from "../../../hooks";
import { produce } from "immer";
import { formatBypassList, parseBypassList } from "../../../helper";
import { updateProfileAction } from "../../../store/profilesSlice";

const { Title, Text } = Typography;

const initialBypassText = formatBypassList(initialBypassList);

const useStyle = createStyles({
  formWrapper: css`
    padding: 16px 24px;
  `,
});

interface ProxyForm extends ProxyOption {
  name: keyof ProxyOptions;
}

interface ByPassForm {
  bypassText: string;
}

const advanceForm: Record<
  "proxyForHttp" | "proxyForHttps" | "proxyForFtp",
  ProxyOption
> = {
  proxyForHttp: initialProxyForHttp,
  proxyForHttps: initialProxyForHttps,
  proxyForFtp: initialProxyForFtp,
};

const columnsMap: Record<string, ProColumns<ProxyForm>> = {
  name: {
    title: "网址协议",
    dataIndex: "name",
    editable: false,
    render: (text) => {
      if (text === "singleProxy") {
        return "所有协议";
      }
      if (text === "proxyForHttp") {
        return "HTTP";
      }
      if (text === "proxyForHttps") {
        return "HTTPS";
      }
      if (text === "proxyForFtp") {
        return "FTP";
      }
      return text;
    },
  },
  scheme: {
    title: "代理协议",
    dataIndex: "scheme",
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

const editableKeys = [
  "singleProxy",
  "proxyForHttp",
  "proxyForHttps",
  "proxyForFtp",
];

interface ProxyProps {
  profile: Profile<ProxyMode.Proxy>;
}

interface SetProxyProps {
  form?: ProxyForm;
  bypassList?: BypassOption[];
}

const Proxy: FC<ProxyProps> = ({ profile }) => {
  const { styles } = useStyle();
  const [proxyType, setProxyType] = useState<ProxyType>("basic");
  const [columns, setColumns] = useState<ProColumns<ProxyForm>[]>([]);
  const [dataSource, setDataSource] = useState<readonly ProxyForm[]>([]);
  const dispatch = useAppDispatch();

  function setBasicProxy(props?: SetProxyProps) {
    const nextState = produce(profile, (draftState) => {
      const { form, bypassList } = props || {};
      const original = draftState.options.singleProxy;
      const originalBypassList = draftState.options.bypassList;
      const options: ProxyOptions = {
        type: "basic",
      };

      if (form && form.name === "singleProxy") {
        options.singleProxy = {
          scheme: form.scheme,
          host: form.host,
          port: form.port,
        };
      } else if (original) {
        options.singleProxy = original;
      } else {
        options.singleProxy = initialSingleProxy;
      }

      if (bypassList) {
        options.bypassList = bypassList;
      } else if (originalBypassList) {
        options.bypassList = originalBypassList;
      } else {
        options.bypassList = initialBypassList;
      }

      draftState.options = options;
    });
    setProxyType("basic");
    setDataSource([{ ...nextState.options.singleProxy!, name: "singleProxy" }]);
    setColumns(
      ["scheme", "host", "port", "option"].map((col) => columnsMap[col]),
    );
    dispatch(updateProfileAction(nextState));
  }

  function setAdvanceProxy(props?: SetProxyProps) {
    const nextState = produce(profile, (draftState) => {
      const { form, bypassList } = props || {};
      const originalBypassList = draftState.options.bypassList;
      const options: ProxyOptions = {
        type: "advance",
      };

      Object.keys(advanceForm).map((key) => {
        if (
          key === "proxyForHttp" ||
          key === "proxyForHttps" ||
          key === "proxyForFtp"
        ) {
          const original = draftState.options[key];
          if (form && form.name === key) {
            options[key] = {
              scheme: form.scheme,
              host: form.host,
              port: form.port,
            };
          } else if (original) {
            options[key] = original;
          } else {
            options[key] = advanceForm[key];
          }
        }
      });

      if (bypassList) {
        options.bypassList = bypassList;
      } else if (originalBypassList) {
        options.bypassList = originalBypassList;
      } else {
        options.bypassList = initialBypassList;
      }

      draftState.options = options;
    });
    setProxyType("advance");
    setDataSource([
      { ...nextState.options.proxyForHttp!, name: "proxyForHttp" },
      { ...nextState.options.proxyForHttps!, name: "proxyForHttps" },
      { ...nextState.options.proxyForFtp!, name: "proxyForFtp" },
    ]);
    setColumns(
      ["name", "scheme", "host", "port", "option"].map(
        (col) => columnsMap[col],
      ),
    );
    dispatch(updateProfileAction(nextState));
  }

  useEffect(() => {
    const { options } = profile;
    if (options.type === "basic") {
      setBasicProxy();
    } else {
      setAdvanceProxy();
    }
  }, []);

  const handleChangeType = ({ target: { value: type } }: RadioChangeEvent) => {
    if (type === "basic") {
      setBasicProxy();
    } else {
      setAdvanceProxy();
    }
  };

  const handleValuesChange = (record: ProxyForm) => {
    if (proxyType === "basic") {
      setBasicProxy({ form: record });
    } else {
      setAdvanceProxy({ form: record });
    }
  };

  // TODO: debounce
  const handleFormChange = (_: unknown, values: ByPassForm) => {
    const { bypassText } = values;
    const bypassList = parseBypassList(bypassText);
    if (proxyType === "basic") {
      setBasicProxy({
        bypassList,
      });
    } else {
      setAdvanceProxy({
        bypassList,
      });
    }
  };

  return (
    <div>
      <EditableProTable<ProxyForm>
        headerTitle={
          <Title level={4}>
            代理服务器
            <Radio.Group
              options={[
                { label: "基础", value: "basic" },
                { label: "高级", value: "advance" },
              ]}
              onChange={handleChangeType}
              value={proxyType}
            />
          </Title>
        }
        columns={columns}
        rowKey="name"
        scroll={{
          x: 800,
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={false}
        editable={{
          type: "multiple",
          editableKeys,
          // actionRender: (row, config, defaultDoms) => {
          //   return [defaultDoms.delete];
          // },
          onValuesChange: handleValuesChange,
        }}
      />
      <div className={styles.formWrapper}>
        <Title level={4}>不代理的地址列表</Title>
        <ProForm<ByPassForm>
          submitter={false}
          onValuesChange={handleFormChange}
        >
          <ProForm.Item>
            <Space direction="vertical">
              <Text>不经过代理连接的主机列表: (每行一个主机)</Text>
              <Button type="link">(可使用通配符等匹配规则…)</Button>
            </Space>
          </ProForm.Item>
          <ProFormTextArea name="bypassText" initialValue={initialBypassText} />
        </ProForm>
      </div>
    </div>
  );
};

export default Proxy;
