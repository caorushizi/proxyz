import { LeftOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Divider, Flex } from "antd";
import { createStyles, css } from "antd-style";
import React, { FC } from "react";
import {
  PageType,
  setPage,
  useHomeStateDispatch,
} from "../nodes/Popup/HomeContext";

const useStyle = createStyles({
  container: css`
    width: 380px;
  `,
  header: css`
    display: flex;
    align-items: center;
    padding: 5px;
  `,
  title: css`
    flex: 1;
  `,
  content: css`
    padding: 5px;
  `,
});

interface PopupCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

const PopupCard: FC<PopupCardProps> = ({ children, header }) => {
  const { styles } = useStyle();
  const dispatch = useHomeStateDispatch();

  return (
    <div className={styles.container}>
      <Flex align="center" className={styles.header}>
        <Button
          onClick={() => {
            dispatch(setPage(PageType.Home));
          }}
          type="text"
          icon={<LeftOutlined />}
        />
        <div className={styles.title}>{header}</div>
        <Button
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
          type="text"
          icon={<SettingOutlined />}
        />
      </Flex>
      <Divider style={{ margin: 0 }} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PopupCard;
