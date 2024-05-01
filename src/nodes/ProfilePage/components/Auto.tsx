import React, { FC, useEffect } from "react";
import type { ProColumns } from "@ant-design/pro-components";
import { DragSortTable, ProForm } from "@ant-design/pro-components";
import { Button, Form, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  selectProfiles,
  updateProfileAction,
} from "../../../store/profilesSlice";
import { ProxyMode } from "../../../helper";
import {
  AutoProxyRule,
  Profile,
  ProfileType,
  initialDirect,
} from "../../../helper/constant";
import SelectItem from "../../../components/SelectItem";
import { DeleteOutlined } from "@ant-design/icons";
import { produce } from "immer";

interface AutoProps {
  profile: Profile<ProxyMode.Auto>;
}

function getTableData(profile: Profile<ProxyMode.Auto>) {
  const { options } = profile;
  const { rules } = options;
  return rules;
}

interface DragSortTableItemProps {
  value?: AutoProxyRule[];
  onChange?: (value: AutoProxyRule[]) => void;
  profiles: ProfileType[];
}

const DragSortTableItem: FC<DragSortTableItemProps> = ({
  value = [],
  onChange = () => {},
  profiles,
}) => {
  const columns: ProColumns[] = [
    {
      title: "排序",
      dataIndex: "sort",
      editable: false,
    },
    {
      title: "条件类型",
      tooltip: "这是一段描述",
      dataIndex: "conditionType",
      className: "drag-visible",
      valueType: "select",
      valueEnum: {
        HostWildcardCondition: { text: "域名通配符", status: "" },
        UrlWildcardCondition: { text: "网址通配符", status: "" },
        UrlRegexCondition: { text: "网址正则", status: "" },
        FalseCondition: { text: "（禁用）", status: "" },
      },
      fieldProps: {
        allowClear: false,
      },
    },
    {
      title: "条件设置",
      dataIndex: "pattern",
    },
    {
      title: "情景模式",
      dataIndex: "profileId",
      valueType: "select",
      valueEnum: [...profiles, initialDirect].reduce<
        Map<number, React.ReactNode>
      >((prev, curr) => {
        prev.set(curr.id, <SelectItem profile={curr} />);
        return prev;
      }, new Map()),
      fieldProps: {
        allowClear: false,
      },
    },
    {
      title: "操作",
      valueType: "option",
    },
  ];

  const handleDragSortEnd = (beforeIndex: number, afterIndex: number) => {
    const nextState = produce(value, (draft) => {
      const [removed] = draft.splice(beforeIndex, 1);
      draft.splice(afterIndex, 0, removed);
    });
    onChange && onChange(nextState);
  };

  const onDeleteRow = (row: AutoProxyRule) => {
    const nextState = produce(value, (draft) => {
      const index = draft.findIndex((item) => item.id === row.id);
      draft.splice(index, 1);
    });
    onChange && onChange(nextState);
  };

  const onTableValuesChange = (record: AutoProxyRule) => {
    const nextState = produce(value, (draft) => {
      const { id, ...rest } = record;
      const index = draft.findIndex((item) => item.id === id);
      draft[index] = {
        ...draft[index],
        ...rest,
      };
    });
    onChange && onChange(nextState);
  };

  return (
    <DragSortTable<AutoProxyRule>
      headerTitle="切换规则"
      scroll={{
        x: 960,
      }}
      columns={columns}
      rowKey="id"
      search={false}
      pagination={false}
      dataSource={value}
      dragSortKey="sort"
      onDragSortEnd={handleDragSortEnd}
      editable={{
        type: "multiple",
        onlyOneLineEditorAlertMessage: "只能编辑一行",
        editableKeys: value.map((item) => item.id),
        onValuesChange: onTableValuesChange,
        actionRender: (row) => {
          return [
            <Button
              type="text"
              key="delete"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteRow(row)}
            />,
          ];
        },
      }}
      footer={() => {
        return (
          <Button block type="dashed">
            添加条件
          </Button>
        );
      }}
    />
  );
};

interface FormProps {
  rules: AutoProxyRule[];
}

const Auto: FC<AutoProps> = ({ profile }) => {
  const profiles = useAppSelector(selectProfiles);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<FormProps>();

  useEffect(() => {
    form.setFieldsValue({
      rules: getTableData(profile),
    });
  }, []);

  const onFinish = (values: FormProps) => {
    dispatch(
      updateProfileAction({
        ...profile,
        options: {
          rules: values.rules,
        },
      }),
    );
    messageApi.success("保存成功");
  };

  return (
    <ProForm
      form={form}
      initialValues={{
        rules: [],
      }}
      onFinish={onFinish}
    >
      {contextHolder}
      <ProForm.Item name="rules">
        <DragSortTableItem profiles={profiles} />
      </ProForm.Item>
    </ProForm>
  );
};

export default Auto;
