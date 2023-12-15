import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin } from 'antd';

export const ChangePassword = () => {
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 3, span: 14 },
  };
  return (
    <Box>
      <PageHeader title="Change Password" />
      <Spin spinning={false} tip="Loading...">
        <Form layout="horizontal" form={form} labelCol={{ span: 3 }} wrapperCol={{ span: 14 }}>
          <Form.Item required name="password" label="Current Password">
            <Input placeholder="" required type="password" />
          </Form.Item>
          <Form.Item name="new_password" label="New Password" required>
            <Input placeholder="" required type="password" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
