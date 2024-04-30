import React from "react";
import PageView from "../../components/PageView";
import { Button, ColorPicker, Modal, Space } from "antd";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  deleteProfileAction,
  selectProfileById,
} from "../../store/profilesSlice";
import { ProxyMode } from "../../helper";
import Proxy from "./components/Proxy";
import Auto from "./components/Auto";
import Virtual from "./components/Virtual";
import PAC from "./components/PAC";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import SelectItem from "../../components/SelectItem";

const { confirm } = Modal;

const Mode: React.FC = () => {
  const { id = "" } = useParams();
  const profile = useAppSelector((state) =>
    selectProfileById(state, Number(id)),
  );
  const dispatch = useAppDispatch();

  const renderProfile = () => {
    if (!profile) {
      return <div>请先选择一个情景模式</div>;
    }

    if (profile.type === ProxyMode.Proxy) {
      return <Proxy profile={profile} />;
    }

    if (profile.type === ProxyMode.Auto) {
      return <Auto profile={profile} />;
    }

    if (profile.type === ProxyMode.Virtual) {
      return <Virtual />;
    }

    if (profile.type === ProxyMode.PAC) {
      return <PAC profile={profile} />;
    }

    return <div>未知情景模式</div>;
  };

  return (
    <PageView
      title={
        <Space>
          <ColorPicker defaultValue={profile?.color} />
          情景模式
        </Space>
      }
      extra={
        <Space>
          {profile && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                confirm({
                  title: "真的要删除这个情景模式吗？",
                  icon: <ExclamationCircleFilled />,
                  content: <SelectItem profile={profile} />,
                  okText: "删除",
                  okButtonProps: { type: "primary" },
                  okType: "danger",
                  cancelText: "取消",
                  onOk() {
                    dispatch(deleteProfileAction(profile.id));
                  },
                  onCancel() {},
                });
              }}
            >
              删除
            </Button>
          )}
        </Space>
      }
    >
      {renderProfile()}
      <div
        style={{
          height: 100,
          overflow: "auto",
          border: "1px solid #000",
          padding: 10,
          marginTop: 30,
        }}
      >
        {JSON.stringify(profile)}
      </div>
    </PageView>
  );
};

export default Mode;
