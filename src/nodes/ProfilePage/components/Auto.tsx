import React, { FC } from "react";
import type { ProColumns } from "@ant-design/pro-components";
import { DragSortTable } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  selectProfiles,
  updateProfileAction,
} from "../../../store/profilesSlice";
import { ProxyMode } from "../../../helper";
import {
  AutoProxyRule,
  Profile,
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

const Auto: FC<AutoProps> = ({ profile }) => {
  const [table, setTable] = useState<AutoProxyRule[]>(getTableData(profile));
  const profiles = useAppSelector(selectProfiles);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleDragSortEnd = (beforeIndex: number, afterIndex: number) => {
    const nextState = produce(profile, (draft) => {
      const [removed] = draft.options.rules.splice(beforeIndex, 1);
      draft.options.rules.splice(afterIndex, 0, removed);
    });
    dispatch(updateProfileAction(nextState));
    setTable(getTableData(nextState));

    messageApi.success("修改列表排序成功");
  };

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
      valueEnum: [...profiles, initialDirect].reduce((prev, curr) => {
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

  const onDeleteRow = (row: AutoProxyRule) => {
    const nextState = produce(profile, (draft) => {
      const index = draft.options.rules.findIndex((item) => item.id === row.id);
      draft.options.rules.splice(index, 1);
    });
    dispatch(updateProfileAction(nextState));
    setTable(getTableData(nextState));
  };

  return (
    <>
      {contextHolder}
      <DragSortTable<AutoProxyRule>
        headerTitle="切换规则"
        scroll={{
          x: 960,
        }}
        columns={columns}
        rowKey="id"
        search={false}
        pagination={false}
        dataSource={table}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
        editable={{
          type: "multiple",
          onlyOneLineEditorAlertMessage: "只能编辑一行",
          editableKeys: table.map((item) => item.id),
          onValuesChange(record) {
            const nextState = produce(profile, (draft) => {
              const { id, ...rest } = record;
              const index = draft.options.rules.findIndex(
                (item) => item.id === id,
              );
              draft.options.rules[index] = {
                ...draft.options.rules[index],
                ...rest,
              };
            });
            dispatch(updateProfileAction(nextState));
            setTable(getTableData(nextState));
          },
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
    </>
  );
};

export default Auto;
