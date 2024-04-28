import {
  Badge,
  Button,
  Checkbox,
  Col,
  Divider,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";
import { PageType, setPage, useHomeStateDispatch } from "../HomeContext";
import { createStyles, css } from "antd-style";
import { LeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const useStyle = createStyles({
  container: css`
    width: 380px;
  `,
});

const Add = () => {
  const { styles } = useStyle();
  const dispatch = useHomeStateDispatch();

  return (
    <div className={styles.container}>
      <Space align="center">
        <Button
          onClick={() => {
            dispatch(setPage(PageType.Home));
          }}
          type="text"
          icon={<LeftOutlined />}
        />
        <Text>加载失败的资源列表</Text>
      </Space>
      <Divider style={{ margin: 0 }} />
      <Text>
        由于网络原因，此页面部分资源加载失败。这些问题可能是由您的网络、代理服务器或网站本身引起的。
      </Text>
      <Text>
        这些问题并非由 SwitchyOmega 自身导致，它只不过检测并报告了错误而已。
      </Text>
      <Checkbox.Group style={{ width: "100%" }}>
        <Row>
          <Col span={24}>
            <Checkbox value="A">
              <Badge status="warning" count={5} />
              *.baidu.com
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox value="A">
              <Badge status="warning" count={5} />
              *.baidu.com
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
      <Text>在使用自动切换情景时，才可以将这些资源添加为切换条件。</Text>
    </div>
  );
};

export default Add;
