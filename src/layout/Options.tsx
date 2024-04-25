import React, { FC } from "react";
import { Layout } from "antd";
import { createStyles, css } from "antd-style";
import { Outlet } from "react-router-dom";
import { ProfileList } from "../store/ProfileList";
import SiderMenu from "../components/SiderMenu";
import { useAsyncEffect } from "ahooks";
import { getProfiles } from "../db/profile";

const useStyle = createStyles({
  container: css`
    height: 100vh;
    background: #fff;
  `,
  header: css`
    background: #fff;
  `,
  sider: css`
    background: #fff;
    border-right: 1px solid #e8e8e8;
  `,
});

const { Sider, Content } = Layout;

const Options: FC = () => {
  const { styles } = useStyle();
  const store = new ProfileList();

  useAsyncEffect(async () => {
    const profiles = await getProfiles();
    store.setProfiles(profiles);
  });

  return (
    <Layout className={styles.container}>
      <Sider theme="light" className={styles.sider}>
        <h1 className={styles.header}>Proxyz</h1>
        <SiderMenu profileList={store} />
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default Options;
