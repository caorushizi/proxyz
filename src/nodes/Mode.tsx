import React, { useState } from "react";
import PageView from "../components/PageView";
import { ColorPicker, Space } from "antd";
import { useParams } from "react-router-dom";
import {
  EditableProTable,
  ProColumns,
  useRefFunction,
} from "@ant-design/pro-components";

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: number;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: "活动名称一",
    decs: "这个活动真好玩",
    state: "open",
    created_at: 1590486176000,
    children: [
      {
        id: 6246912293,
        title: "活动名称二",
        decs: "这个活动真好玩",
        state: "closed",
        created_at: 1590481162000,
      },
      {
        id: 6246912294,
        title: "活动名称二",
        decs: "这个活动真好玩",
        state: "closed",
        created_at: 1590481162000,
      },
      {
        id: 6246912295,
        title: "活动名称二",
        decs: "这个活动真好玩",
        state: "closed",
        created_at: 1590481162000,
      },
    ],
  },
];

const loopDataSourceFilter = (
  data: readonly DataSourceType[],
  id: React.Key | undefined,
): DataSourceType[] => {
  return data
    .map((item) => {
      if (item.id !== id) {
        if (item.children) {
          const newChildren = loopDataSourceFilter(item.children, id);
          return {
            ...item,
            children: newChildren.length > 0 ? newChildren : undefined,
          };
        }
        return item;
      }
      return null;
    })
    .filter(Boolean) as DataSourceType[];
};

const Mode = () => {
  const { id } = useParams();

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.flatMap((item) => item.id),
  );
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(
    () => defaultData,
  );

  console.log("editableKeys", editableKeys);

  const removeRow = useRefFunction((record: DataSourceType) => {
    setDataSource(loopDataSourceFilter(dataSource, record.id));
  });
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "活动名称",
      dataIndex: "title",
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 2 ? [{ required: true, message: "此项为必填项" }] : [],
        };
      },
    },
    {
      title: "状态",
      key: "state",
      dataIndex: "state",
      valueType: "select",
      valueEnum: {
        all: { text: "全部", status: "Default" },
        open: {
          text: "未解决",
          status: "Error",
        },
        closed: {
          text: "已解决",
          status: "Success",
        },
      },
    },
    {
      title: "描述",
      dataIndex: "decs",
      fieldProps: (form, { rowKey, rowIndex }) => {
        if (form.getFieldValue([rowKey || "", "title"]) === "不好玩") {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: "活动时间",
      dataIndex: "created_at",
      valueType: "date",
    },
    {
      title: "操作",
      valueType: "option",
      render: (text, record) => [
        <a
          key="delete"
          onClick={() => {
            removeRow(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageView
      title={
        <Space>
          <ColorPicker defaultValue="#1677ff" />
          情景模式
        </Space>
      }
    >
      Mode {id}
      <EditableProTable<DataSourceType>
        headerTitle="可编辑表格"
        columns={columns}
        rowKey="id"
        scroll={{
          x: 960,
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={{
          newRecordType: "dataSource",
          record: () => ({
            id: Date.now(),
          }),
        }}
        editable={{
          type: "multiple",
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </PageView>
  );
};

export default Mode;
