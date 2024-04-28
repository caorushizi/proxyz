import React from "react";
import type { ProColumns } from "@ant-design/pro-components";
import { DragSortTable } from "@ant-design/pro-components";
import { Button, Space, message } from "antd";
import { useState } from "react";
import { useAppSelector } from "../../../hooks";
import { selectProfiles } from "../../../store/profilesSlice";
import ProxyIcon from "../../../components/ProxyIcon";
import { ProxyMode } from "../../../helper";

const data = [
  {
    key: 1,
    conditionType: "HostWildcardCondition",
    pattern: "",
    profileName: "",
  },
];

const Auto = () => {
  const [dataSource1, setDatasource1] = useState(data);
  const profiles = useAppSelector(selectProfiles);
  const handleDragSortEnd1 = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    setDatasource1(newDataSource);
    message.success("修改列表排序成功");
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
      dataIndex: "profileName",
      valueType: "select",
      valueEnum: [...profiles, "direct"].reduce<Map<string, React.ReactNode>>(
        (prev, curr) => {
          if (typeof curr === "string") {
            prev.set(
              "123",
              <Space>
                <ProxyIcon type={ProxyMode.Direct} />
                直接连接
              </Space>,
            );
            return prev;
          }
          prev.set(
            curr.name,
            <Space>
              <ProxyIcon type={curr.type} color={curr.color} />
              {curr.name}
            </Space>,
          );
          return prev;
        },
        new Map(),
      ),
      fieldProps: {
        allowClear: false,
      },
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

  return (
    <>
      <DragSortTable
        headerTitle="切换规则"
        scroll={{
          x: 960,
        }}
        columns={columns}
        rowKey="key"
        search={false}
        pagination={false}
        dataSource={dataSource1}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd1}
        editable={{
          type: "multiple",
          onlyOneLineEditorAlertMessage: "只能编辑一行",
          editableKeys: [1, 2, 3, 4],
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
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
