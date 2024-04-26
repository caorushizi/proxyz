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
import Profile from "./nodes/Profile";
import "./assets/base.scss";
import { store } from "./store";
import { Provider } from "react-redux";

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
        element: <Profile />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <App>
          <RouterProvider router={router} />
        </App>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>,
);
