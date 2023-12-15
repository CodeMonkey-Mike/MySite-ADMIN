import { ArrowLeftOutlined } from '@ant-design/icons';
import { Divider, PageHeader as Instance } from 'antd';
import { PageHeaderProps } from 'antd/lib/page-header';
import styled from 'styled-components';

const Line = styled(Divider)`
  margin: var(--space-0) 0 var(--space-5);
`;

export const PageHeader = ({
  title,
  icon = false,
  ...props
}: PageHeaderProps & { icon?: boolean }) => {
  return (
    <>
      <Instance
        backIcon={!icon ? false : <ArrowLeftOutlined />}
        title={title}
        style={{ paddingLeft: 0 }}
        {...props}
      />
      <Line />
    </>
  );
};
