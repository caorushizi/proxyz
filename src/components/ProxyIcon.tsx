import React from "react";
import { ProxyMode } from "../helper";
import {
  GlobalOutlined,
  RetweetOutlined,
  SnippetsOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
} from "@ant-design/icons";

interface ProxyIconProps {
  type: ProxyMode;
  color?: string;
}

const ProxyIcon: React.FC<ProxyIconProps> = ({ type, color }) => {
  if (type === ProxyMode.Proxy) {
    return <GlobalOutlined style={{ color }} />;
  }
  if (type === ProxyMode.Auto) {
    return <RetweetOutlined style={{ color }} />;
  }
  if (type === ProxyMode.PAC) {
    return <SnippetsOutlined style={{ color }} />;
  }
  if (type === ProxyMode.Virtual) {
    return <QuestionCircleOutlined style={{ color }} />;
  }
  if (type === ProxyMode.Direct) {
    return <SwapOutlined style={{ color }} />;
  }

  return null;
};

export default ProxyIcon;
