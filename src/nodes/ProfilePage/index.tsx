import React, { useEffect } from "react";
import PageView from "../../components/PageView";
import { Button, ColorPicker, Modal, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
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
import { ProfileType } from "../../helper/constant";

const { confirm } = Modal;

const Mode: React.FC = () => {
  const { id = "" } = useParams();
  const profile = useAppSelector((state) => selectProfileById(state, id));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/");
    }
  }, []);

  const renderProfile = (profile: ProfileType) => {
    if (profile.type === ProxyMode.Proxy) {
      return <Proxy profile={profile} />;
    }

    if (profile.type === ProxyMode.Auto) {
      return <Auto profile={profile} />;
    }

    if (profile.type === ProxyMode.Virtual) {
      return <Virtual profile={profile} />;
    }

    if (profile.type === ProxyMode.PAC) {
      return <PAC profile={profile} />;
    }

    return <div>未知情景模式</div>;
  };

  // 如果没有profile，返回null
  if (!profile) return null;

  const onDelete = () => {
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
  };

  const renderTitle = () => {
    return (
      <Space>
        <ColorPicker value={profile.color} />
        情景模式：{profile.name}
      </Space>
    );
  };

  const renderExtra = () => {
    return (
      <Space>
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
        >
          删除
        </Button>
      </Space>
    );
  };

  // 如果有profile，返回页面
  return (
    <PageView title={renderTitle()} extra={renderExtra()}>
      {renderProfile(profile)}
    </PageView>
  );
};

export default Mode;
