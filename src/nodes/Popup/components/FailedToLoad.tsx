import {
  Badge,
  Button,
  Checkbox,
  Col,
  Form,
  Row,
  Select,
  Typography,
} from "antd";
import { createStyles, css } from "antd-style";
import React from "react";
import { ProxyMode, getWildcard } from "../../../helper";
import PopupCard from "../../../components/PopupCard";
import SelectItem from "../../../components/SelectItem";
import { useSelector } from "react-redux";
import {
  selectActiveProfile,
  selectPopupState,
} from "../../../store/popupSlice";
import {
  addAutoConditionAction,
  selectProfiles,
} from "../../../store/profilesSlice";
import { useAsyncEffect } from "ahooks";
import localforage from "localforage";
import { useAppDispatch } from "../../../hooks";
import { AutoProxyRule } from "../../../helper/constant";
import useChrome from "../../../hooks/chrome";
import { findProfile } from "../../../db/profile";
import { v4 as uuidv4 } from "uuid";

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
function groupByDomain(resources: string[]) {
  const group: Record<string, number> = {};
  resources.forEach((url) => {
    const wildcard = getWildcard(url);
    if (wildcard) {
      group[wildcard] = (group[wildcard] || 0) + 1;
    }
  });
  return group;
}

interface FormValues {
  domains: string[];
  profileId: number;
}

const FailedToLoad = () => {
  const { styles } = useStyle();
  const { resources } = useSelector(selectPopupState);
  const activeProfile = useSelector(selectActiveProfile);
  const profiles = useSelector(selectProfiles);
  const [form] = Form.useForm<FormValues>();
  const dispatch = useAppDispatch();
  const { setProfile } = useChrome();

  const group = groupByDomain(resources);

  useAsyncEffect(async () => {
    const lastProfileId = await localforage.getItem<number>("lastProfileId");
    const hasCurrentProfile = profiles.find((i) => i.id === lastProfileId);
    if (lastProfileId && hasCurrentProfile) {
      form.setFieldsValue({
        profileId: lastProfileId,
      });
    }
    form.setFieldsValue({
      domains: Object.keys(group),
    });
  }, []);

  const renderItem = (domain: string, count: number) => {
    return (
      <div className={styles.checkBoxNode}>
        <Badge
          style={{ borderRadius: 5, marginLeft: 5 }}
          color="orange"
          count={count}
        />
        <Text className={styles.checkBoxText}>{domain}</Text>
      </div>
    );
  };

  const onSubmit = async () => {
    if (!activeProfile) return;
    await form.validateFields();
    const { profileId, domains } = form.getFieldsValue();
    const { id } = activeProfile;
    const rules: AutoProxyRule[] = domains.map((domain) => ({
      id: uuidv4(),
      conditionType: "HostWildcardCondition",
      pattern: domain,
      profileId,
    }));
    await dispatch(addAutoConditionAction({ id, rules })).unwrap();
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) return;
    const profile = await findProfile(id);
    await localforage.setItem("lastProfileId", profileId);
    await setProfile(profile);
    await chrome.tabs.reload(tab.id);
    // 关闭窗口
    window.close();
  };

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
      {activeProfile?.type === ProxyMode.Auto && (
        <Form form={form}>
          <Form.Item
            name="domains"
            required
            rules={[
              {
                required: true,
                message: "请选择域名",
              },
            ]}
          >
            <Checkbox.Group className={styles.checkBox}>
              <Row>
                {Object.entries(group).map(([domain, count]) => (
                  <Col
                    span={24}
                    key={domain}
                    className={styles.checkBoxWrapper}
                  >
                    <Checkbox value={domain}>
                      {renderItem(domain, count)}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="profileId"
            label="对所有选中的域名使用此情景模式："
            required
            rules={[
              {
                required: true,
                message: "请选择情景模式",
              },
            ]}
          >
            <Select
              placeholder="请选择情景模式"
              style={{ width: "100%" }}
              options={profiles
                .filter(
                  (profile) =>
                    profile.type !== ProxyMode.System &&
                    profile.type !== ProxyMode.Auto,
                )
                .map((item) => ({
                  value: item.id,
                  label: <SelectItem profile={item} />,
                }))}
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" onClick={onSubmit}>
              添加条件
            </Button>
          </Form.Item>
        </Form>
      )}

      {activeProfile?.type !== ProxyMode.Auto && (
        <>
          {Object.entries(group).map(([domain, count]) =>
            renderItem(domain, count),
          )}
          <Paragraph>
            <Text type="secondary">
              在使用自动切换情景时，才可以将这些资源添加为切换条件。
            </Text>
          </Paragraph>
        </>
      )}
    </PopupCard>
  );
};

export default FailedToLoad;
