import React, { FC } from "react";
import ProxyIcon from "./ProxyIcon";
import { ProfileType } from "../helper/constant";
import { createStyles, css } from "antd-style";

interface SelectItemProps {
  profile: ProfileType;
}

const useStyle = createStyles({
  selectItem: css`
    display: flex;
    align-items: center;
  `,
  selectText: css`
    margin-left: 10px;
  `,
});

const SelectItem: FC<SelectItemProps> = ({ profile }) => {
  const { styles } = useStyle();

  return (
    <div className={styles.selectItem}>
      <ProxyIcon type={profile.type} color={profile.color} />
      <div className={styles.selectText}>{profile.name}</div>
    </div>
  );
};

export default SelectItem;
