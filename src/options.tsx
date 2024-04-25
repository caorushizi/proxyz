import React from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import Options from "./layout/Options";
import { ConfigProvider, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Interface from "./nodes/Interface";
import General from "./nodes/General";
import Export from "./nodes/Export";
import Mode from "./nodes/Mode";
import "./assets/base.scss";

const router = createHashRouter([
  {
    path: "/",
    element: <Options />,
    children: [
      {
        path: "/",
        element: <Interface />,
      },
      {
        path: "/general",
        element: <General />,
      },
      {
        path: "/export",
        element: <Export />,
      },
      {
        path: "/profile/:id",
        element: <Mode />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App>
        <RouterProvider router={router} />
      </App>
    </ConfigProvider>
  </React.StrictMode>,
);
