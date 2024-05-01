import React, { FC } from "react";
import { Layout } from "antd";
import { createStyles, css } from "antd-style";
import { Link, Outlet } from "react-router-dom";
import SiderMenu from "../components/SiderMenu";
import { useAsyncEffect } from "ahooks";
import { useAppDispatch } from "../hooks";
import { initProfilesAction } from "../store/profilesSlice";
import { name } from "../../package.json";

const useStyle = createStyles({
  container: css`
    height: 100vh;
    background: #fff;
  `,
  header: css`
    background: #fff;
    padding: 8px 16px 0;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  `,
  sider: css`
    background: #fff;
    border-right: 1px solid #e8e8e8;
    overflow: auto;
  `,
});

const { Sider, Content } = Layout;

const Options: FC = () => {
  const { styles } = useStyle();
  const dispatch = useAppDispatch();

  useAsyncEffect(async () => {
    dispatch(initProfilesAction());
  });

  return (
    <Layout className={styles.container}>
      <Sider theme="light" className={styles.sider}>
        <div className={styles.header}>
          <Link to={"/"}>{name.toUpperCase()}</Link>
        </div>
        <SiderMenu />
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default Options;
