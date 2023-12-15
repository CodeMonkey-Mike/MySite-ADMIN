import { useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message, Checkbox } from 'antd';
import { IChannelItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { CREATE_CHANNEL } from 'src/graphql/mutation/channels.mutation';

export const AddChannel = () => {
  const route = useRouter();
  const sequence = _get(route, 'query.sequence', 1);
  const [creatChannel, { loading, error }] = useMutation(CREATE_CHANNEL);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IChannelItem) => {
    await creatChannel({
      variables: {
        ...values,
        sequence: Number(sequence),
      },
    });
    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Channel" subTitle="Add new" />
      <Spin spinning={loading} tip="Loading...">
        <Form
          layout="horizontal"
          form={form}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="url" required label="URL">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="icon" required label="Font-Awesome class name">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="visible" {...tailLayout} valuePropName="checked">
            <Checkbox>Visible</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
