import React from "react";
import type { ProColumns } from "@ant-design/pro-components";
import { DragSortTable } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useState } from "react";

const data = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: 3,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];

const Auto = () => {
  const columns: ProColumns[] = [
    {
      title: "排序",
      dataIndex: "sort",
      editable: false,
    },
    {
      title: "条件类型",
      tooltip: "这是一段描述",
      dataIndex: "name",
      className: "drag-visible",
      valueType: "select",
      valueEnum: {
        direct: { text: "域名通配符", status: "direct" },
        http: { text: "网址通配符", status: "http" },
        https: { text: "网址正则", status: "https" },
        sock4: { text: "（禁用）", status: "sock4" },
      },
      fieldProps: {
        allowClear: false,
      },
    },
    {
      title: "条件设置",
      dataIndex: "age",
    },
    {
      title: "情景模式",
      dataIndex: "address",
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
      title: "操作",
      valueType: "option",
      render: () => [
        <a key="delete" onClick={() => {}}>
          删除
        </a>,
      ],
    },
  ];
  const [dataSource1, setDatasource1] = useState(data);
  const handleDragSortEnd1 = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    setDatasource1(newDataSource);
    message.success("修改列表排序成功");
  };

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
