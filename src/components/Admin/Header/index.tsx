import React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { Flex } from 'theme-ui';
import { useAuth } from 'src/hooks';

const { Header } = Layout;

export const DashboardHeader = ({
  setCollapsed = () => {},
  collapsed = false,
}: {
  setCollapsed: (collapsed: boolean) => void;
  collapsed: boolean;
}) => {
  const { onLogout } = useAuth();

  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <Flex
        sx={{
          alignItems: 'center',
          paddingX: 10,
          height: '100%',
        }}
      >
        <Row
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Col span="12">
            <Flex>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                style: { color: 'white' },
                onClick: () => setCollapsed(!collapsed),
              })}
            </Flex>
          </Col>
          <Col span="12">
            <Flex
              sx={{
                justifyContent: 'flex-end',
              }}
            >
              <Button
                style={{
                  marginLeft: 15,
                }}
                onClick={() => onLogout()}
                icon={<LogoutOutlined />}
              >
                Log out
              </Button>
            </Flex>
          </Col>
        </Row>
      </Flex>
    </Header>
  );
};
