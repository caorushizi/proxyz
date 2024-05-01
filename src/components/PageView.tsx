import React from "react";
import { createStyles, css } from "antd-style";
import clsx from "clsx";

const useStyle = createStyles({
  container: css`
    display: flex;
    flex-direction: column;
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
  inner: css`
    padding: 10px;
    overflow: auto;
    flex: 1;
  `,
  footer: css`
    padding: 10px;
    flex-shrink: 0;
  `,
});

interface PageViewProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  title: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
}

const PageView: React.FC<PageViewProps> = ({
  children,
  className,
  title,
  extra,
  wrapperClassName,
  footer,
}) => {
  const { styles } = useStyle();

  return (
    <div className={clsx([styles.container, wrapperClassName])}>
      <div className={styles.header}>
        <div>{title}</div>
        <div>{extra}</div>
      </div>
      <div className={clsx([styles.inner, className])}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default PageView;
