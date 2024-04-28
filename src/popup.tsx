import React from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import Popup from "./nodes/Popup";
import "./popup.scss";

const root = createRoot(document.getElementById("app")!);

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: [theme.compactAlgorithm],
      }}
      locale={zhCN}
    >
      <Popup />
    </ConfigProvider>
  </React.StrictMode>,
);
