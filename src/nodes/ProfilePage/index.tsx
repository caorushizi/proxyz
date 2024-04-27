import React from "react";
import PageView from "../../components/PageView";
import { ColorPicker, Space } from "antd";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { selectProfileById } from "../../store/profilesSlice";
import { ProxyMode } from "../../helper";
import Proxy from "./components/Proxy";
import Auto from "./components/Auto";
import Virtual from "./components/Virtual";
import PAC from "./components/PAC";

const Mode: React.FC = () => {
  const { id = "" } = useParams();
  const profile = useAppSelector((state) =>
    selectProfileById(state, Number(id)),
  );

  const renderProfile = () => {
    if (!profile) {
      return <div>请先选择一个情景模式</div>;
    }

    if (profile.type === ProxyMode.Proxy) {
      return <Proxy profile={profile} />;
    }

    if (profile.type === ProxyMode.Auto) {
      return <Auto />;
    }

    if (profile.type === ProxyMode.Virtual) {
      return <Virtual />;
    }

    if (profile.type === ProxyMode.PAC) {
      return <PAC />;
    }

    return <div>未知情景模式</div>;
  };

  return (
    <PageView
      title={
        <Space>
          <ColorPicker defaultValue={profile?.color} />
          情景模式 {JSON.stringify(profile)}
        </Space>
      }
    >
      {renderProfile()}
    </PageView>
  );
};

export default Mode;
