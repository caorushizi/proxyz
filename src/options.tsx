import React from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import Options from "./layout/Options";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Settings from "./nodes/Settings";
import About from "./nodes/About";
import ProfilePage from "./nodes/ProfilePage";
import "./assets/base.scss";
import { store } from "./store";
import { Provider } from "react-redux";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
// @ts-expect-error missing type
import TSWorker from "url:monaco-editor/esm/vs/language/typescript/ts.worker";

self.MonacoEnvironment = {
  getWorkerUrl: () => TSWorker,
};
loader.config({ monaco });
loader.init();

const router = createHashRouter([
  {
    path: "/",
    element: <Options />,
    children: [
      {
        path: "/",
        element: <About />,
      },
      {
        path: "/Settings",
        element: <Settings />,
      },
      {
        path: "/profile/:id",
        element: <ProfilePage />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>,
);
