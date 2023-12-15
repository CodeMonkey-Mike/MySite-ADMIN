import React, { useState } from 'react';
import { AdminLogo as Logo, MainMenu, DashboardHeader as Header } from 'src/components/Admin';
import { Layout } from 'antd';
import { Box } from 'theme-ui';

const { Sider, Content } = Layout;

export const Home = ({ children }: { children: React.ReactChild | React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ height: '100%' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Logo />
        <MainMenu />
      </Sider>
      <Layout>
        <Header setCollapsed={() => setCollapsed(!collapsed)} collapsed={collapsed} />
        <Content style={{ overflow: 'auto' }}>
          <Box
            sx={{
              padding: '20px',
            }}
          >
            {children}
          </Box>
        </Content>
      </Layout>
    </Layout>
  );
};
