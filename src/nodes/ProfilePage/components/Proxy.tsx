import React, { FC, useEffect, useState } from "react";
import {
  EditableProTable,
  ProColumns,
  ProForm,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, Radio, Space, Typography } from "antd";
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

interface ProxyForm extends ProxyOption {
  name: keyof ProxyOptions;
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
  form?: ProxyForm[];
  bypassList?: BypassOption[];
}

interface TypeType {
  type: ProxyType;
  columns: ProColumns<ProxyForm>[];
}

const typeState: Record<ProxyType, TypeType> = {
  basic: {
    type: "basic",
    columns: ["scheme", "host", "port", "option"].map((col) => columnsMap[col]),
  },
  advance: {
    type: "advance",
    columns: ["name", "scheme", "host", "port", "option"].map(
      (col) => columnsMap[col],
    ),
  },
};

const Proxy: FC<ProxyProps> = ({ profile }) => {
  const [state, setState] = useState<TypeType>(typeState.basic);
  const dispatch = useAppDispatch();
  const [form] = ProForm.useForm();

  function setBasicProxy(props?: SetProxyProps) {
    const nextState = produce(profile, (draftState) => {
      const { form, bypassList } = props || {};
      const original = draftState.options.singleProxy;
      const originalBypassList = draftState.options.bypassList;
      const options: ProxyOptions = {
        type: "basic",
      };

      if (original) {
        options.singleProxy = original;
      } else {
        options.singleProxy = initialSingleProxy;
      }

      form?.forEach((item) => {
        if (item.name === "singleProxy") {
          options.singleProxy = {
            scheme: item.scheme,
            host: item.host,
            port: item.port,
          };
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

    return nextState;
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
          if (original) {
            options[key] = original;
          } else {
            options[key] = advanceForm[key];
          }
        }
      });

      form?.forEach((item) => {
        if (
          item.name === "proxyForHttp" ||
          item.name === "proxyForHttps" ||
          item.name === "proxyForFtp"
        ) {
          options[item.name] = {
            scheme: item.scheme,
            host: item.host,
            port: item.port,
          };
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

    return nextState;
  }

  useEffect(() => {
    const { options } = profile;
    handleChangeType(options.type);
  }, []);

  const handleChangeType = (type: ProxyType) => {
    setState(typeState[type]);
    if (type === "basic") {
      const nextState = setBasicProxy();
      form.setFieldsValue({
        rules: [{ ...nextState.options.singleProxy!, name: "singleProxy" }],
        bypassText: formatBypassList(nextState.options.bypassList!),
      });
    } else {
      const nextState = setAdvanceProxy();
      form.setFieldsValue({
        rules: [
          { ...nextState.options.proxyForHttp!, name: "proxyForHttp" },
          { ...nextState.options.proxyForHttps!, name: "proxyForHttps" },
          { ...nextState.options.proxyForFtp!, name: "proxyForFtp" },
        ],
        bypassText: formatBypassList(nextState.options.bypassList!),
      });
    }
  };

  return (
    <ProForm
      form={form}
      validateTrigger="onBlur"
      onFinish={() => {
        const { rules, bypassText } = form.getFieldsValue();

        const params = {
          form: rules,
          bypassList: parseBypassList(bypassText),
        };
        const nextState =
          state.type === "basic"
            ? setBasicProxy(params)
            : setAdvanceProxy(params);
        dispatch(updateProfileAction(nextState));
      }}
    >
      <EditableProTable<ProxyForm>
        headerTitle={
          <Title level={4}>
            代理服务器
            <Radio.Group
              options={[
                { label: "基础", value: "basic" },
                { label: "高级", value: "advance" },
              ]}
              onChange={(e) => handleChangeType(e.target.value)}
              value={state.type}
            />
          </Title>
        }
        name="rules"
        columns={state.columns}
        rowKey="name"
        scroll={{
          x: 800,
        }}
        recordCreatorProps={false}
        editable={{
          type: "multiple",
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
        }}
      />
      <ProForm.Item label={<Title level={4}>不代理的地址列表</Title>}>
        <Space direction="vertical">
          <Text>不经过代理连接的主机列表: (每行一个主机)</Text>
          <Button type="link">(可使用通配符等匹配规则…)</Button>
        </Space>
      </ProForm.Item>
      <ProFormTextArea name="bypassText" />
    </ProForm>
  );
};

export default Proxy;
