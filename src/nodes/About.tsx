import React from "react";
import PageView from "../components/PageView";
import { Button, Flex, Typography } from "antd";
import { version } from "../../package.json";
import {
  DownloadOutlined,
  EyeInvisibleOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import Logo from "../assets/logo.png";
import { createStyles, css } from "antd-style";
import { name, description } from "../../package.json";

const { Text, Link } = Typography;

const useStyle = createStyles({
  about: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  logoImg: css`
    display: inline-block;
    width: 32px;
    height: 32px;
  `,
  logoTitle: css`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  `,
  footer: css`
    flex-shrink: 0;
  `,
});

const About = () => {
  const { styles } = useStyle();

  return (
    <PageView
      title="关于"
      className={styles.about}
      footer={
        <Flex vertical className={styles.footer}>
          <Text>SwitchyOmega</Text>
          <Text>
            版权所有 2012-2017 <Link href="">The SwitchyOmega Authors.</Link>
            保留所有权利。
          </Text>
          <Text>
            SwitchyOmega 是<Link href="">自由软件</Link>，使用
            <Link href="">GNU General Public License</Link>
            版本 3 及以上授权。
          </Text>
          <Text>
            SwitchyOmega 的诞生离不开 <Link href="">SwitchyOmega</Link>
            开源项目和其他<Link href="">开源软件</Link>。
          </Text>
        </Flex>
      }
    >
      <Flex gap={15} vertical flex={1}>
        <Flex gap={15} align="center">
          <img src={Logo} alt="logo" className={styles.logoImg} />
          <Flex justify="center" vertical>
            <div>
              <span className={styles.logoTitle}>{name}</span>
              <Text>（version {version}）</Text>
            </div>
            <Text type="secondary">{description}</Text>
          </Flex>
        </Flex>
        <Flex gap={10}>
          <Button type="primary" icon={<MessageOutlined />}>
            反馈问题
          </Button>
          <Button icon={<DownloadOutlined />}>保存错误日志</Button>
          <Button danger type="primary" icon={<WarningOutlined />}>
            重置选项
          </Button>
        </Flex>

        <Text type="warning">
          <InfoCircleOutlined />
          SwitchyOmega 不提供代理服务器、VPN等网络服务。
        </Text>
        <Text type="success">
          <EyeInvisibleOutlined />
          SwitchyOmega 不会跟踪您的上网记录，不在页面中插入广告。请参见我们的
          <Link href="">隐私政策</Link>。
        </Text>
        <Text type="secondary">
          <QuestionCircleOutlined />
          如有其他问题或者需要帮助，请参考<Link href="">常见问题</Link>。
        </Text>
      </Flex>
    </PageView>
  );
};

export default About;
