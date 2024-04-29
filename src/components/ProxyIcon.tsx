import React from "react";
import { ProxyMode } from "../helper";
import {
  GlobalOutlined,
  SnippetsOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
  PoweroffOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { createStyles, css } from "antd-style";
import clsx from "clsx";

interface ProxyIconProps {
  type: ProxyMode;
  color?: string;
  virtual?: boolean;
}

const useStyle = createStyles({
  virtual: css`
    position: relative;
    &::before {
      content: "";
      display: block;
      border-width: 1px;
      border-style: dashed;
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      border-radius: 4px;
    }
  `,
});

const ProxyIcon: React.FC<ProxyIconProps> = ({ type, color, virtual }) => {
  const { styles } = useStyle();

  const iconStyle = { color };
  const iconClass = clsx({ [styles.virtual]: virtual });

  if (type === ProxyMode.Proxy) {
    return <GlobalOutlined className={iconClass} style={iconStyle} />;
  }
  if (type === ProxyMode.Auto) {
    return <SyncOutlined className={iconClass} style={iconStyle} />;
  }
  if (type === ProxyMode.PAC) {
    return <SnippetsOutlined className={iconClass} style={iconStyle} />;
  }
  if (type === ProxyMode.Direct) {
    return <SwapOutlined className={iconClass} style={{ color: "#aaa" }} />;
  }
  if (type === ProxyMode.System) {
    return <PoweroffOutlined className={iconClass} style={{ color: "#000" }} />;
  }
  return (
    <QuestionCircleOutlined className={styles.virtual} style={iconStyle} />
  );
};

export default ProxyIcon;
