import React from "react";
import { createStyles, css } from "antd-style";
import clsx from "clsx";

const useStyle = createStyles({
  container: css`
    height: 100vh;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
    height: 50px;
  `,
  title: css``,
  extra: css``,
  inner: css`
    padding: 10px;
    overflow: auto;
    height: calc(100% - 50px);
  `,
});

interface PageViewProps {
  children: React.ReactNode;
  className?: string;
  title: React.ReactNode;
  extra?: React.ReactNode;
}

const PageView: React.FC<PageViewProps> = ({
  children,
  className,
  title,
  extra,
}) => {
  const { styles } = useStyle();

  return (
    <div className={clsx([styles.container, className])}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div>{extra}</div>
      </div>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};

export default PageView;
