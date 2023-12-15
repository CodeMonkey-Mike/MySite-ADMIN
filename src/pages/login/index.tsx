import React, { useEffect, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { Flex, Text } from 'theme-ui';
import { LOGIN } from 'src/graphql/mutation/user.mutattion';
import { Layout as LayoutRoot, Form, Input, Button, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import { AuthContext } from 'src/contexts/auth/auth.context';

const { Content } = LayoutRoot;

const ContentLoginStyle = css`
  max-width: 300px;
  margin-top: 50px;
`;

const WrapperForm = styled(Content)`
  ${ContentLoginStyle}
`;

type LoginType = {
  usernameOrEmail: string;
  password: string;
};

const Admin = () => {
  const [UseLogin, { loading, data }] = useMutation(LOGIN);
  const router = useRouter();
  const { authDispatch } = React.useContext<any>(AuthContext);
  const onLogin = async (values: LoginType) => {
    await UseLogin({
      variables: {
        ...values,
      },
    });
  };
  useEffect(() => {
    if (data && data.login && data.login.user) {
      authDispatch({ type: 'SIGNIN_SUCCESS', userInfo: data.login.user, token: data.login.token });
      router.replace('/');
    }
  }, [data, authDispatch, router]);

  const error = useMemo(() => !!data && !!data.login.errors && data.login.errors[0], [data]);

  if (error) message.error(error.message);
  return (
    <Flex
      sx={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <WrapperForm>
        <Text
          sx={{
            fontSize: 30,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          <Text>Admin Portal</Text>
        </Text>
        <Spin spinning={loading} tip="Loading...">
          <Form
            name="admin_login"
            className="login-form"
            initialValues={{ remember: false }}
            onFinish={onLogin}
          >
            <Form.Item
              name="usernameOrEmail"
              rules={[{ required: true, message: 'Please input your Email / Username!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Button
              size="large"
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form>
        </Spin>
      </WrapperForm>
    </Flex>
  );
};
export default Admin;
