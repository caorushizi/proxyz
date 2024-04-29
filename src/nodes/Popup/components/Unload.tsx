import { Badge, Checkbox, Col, Row, Typography } from "antd";
import { createStyles, css } from "antd-style";
import React from "react";
import { useHomeState } from "../HomeContext";
import { getWildcard } from "../../../helper";
import PopupCard from "../../../components/PopupCard";

const { Paragraph, Text } = Typography;

const useStyle = createStyles({
  title: css`
    margin-left: 5px;
    font-size: 16px;
    font-weight: 600;
  `,
  checkBoxWrapper: css`
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  `,
  checkBoxNode: css`
    display: flex;
    align-items: center;
  `,
  checkBox: css`
    margin-bottom: 10px;
    width: 100%;
  `,
  checkBoxText: css`
    padding-left: 10px;
  `,
});

// 使用通配符分组
function groupByDomain(urls: string[]) {
  const group: Record<string, number> = {};
  urls.forEach((url) => {
    const wildcard = getWildcard(url);
    if (wildcard) {
      group[wildcard] = (group[wildcard] || 0) + 1;
    }
  });
  return group;
}

const Unload = () => {
  const { styles } = useStyle();
  const { urls } = useHomeState();

  const group = groupByDomain(urls);

  return (
    <PopupCard
      header={<Text className={styles.title}>加载失败的资源列表</Text>}
    >
      <Paragraph>
        <Text type="warning">
          由于网络原因，此页面部分资源加载失败。这些问题可能是由您的网络、代理服务器或网站本身引起的。
        </Text>
      </Paragraph>
      <Paragraph>
        <Text type="secondary">
          这些问题并非由 SwitchyOmega 自身导致，它只不过检测并报告了错误而已。
        </Text>
      </Paragraph>
      <Checkbox.Group className={styles.checkBox}>
        <Row>
          {Object.entries(group).map(([domain, count]) => (
            <Col span={24} key={domain} className={styles.checkBoxWrapper}>
              <Checkbox value="A">
                <div className={styles.checkBoxNode}>
                  <Badge
                    style={{ borderRadius: 5, marginLeft: 5 }}
                    color="orange"
                    count={count}
                  />
                  <Text className={styles.checkBoxText}>{domain}</Text>
                </div>
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
      <Paragraph>
        <Text type="secondary">
          在使用自动切换情景时，才可以将这些资源添加为切换条件。
        </Text>
      </Paragraph>
    </PopupCard>
  );
};

export default Unload;
