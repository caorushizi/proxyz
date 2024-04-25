import React from "react";
import { ProxyMode } from "../helper";
import {
  GlobalOutlined,
  RetweetOutlined,
  SnippetsOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

interface ProxyIconProps {
  type: ProxyMode;
}

const ProxyIcon: React.FC<ProxyIconProps> = ({ type }) => {
  if (type === ProxyMode.Proxy) {
    return <GlobalOutlined />;
  }
  if (type === ProxyMode.AutoProxy) {
    return <RetweetOutlined />;
  }
  if (type === ProxyMode.PAC) {
    return <SnippetsOutlined />;
  }
  if (type === ProxyMode.Virtual) {
    return <QuestionCircleOutlined />;
  }

  return null;
};

export default ProxyIcon;
