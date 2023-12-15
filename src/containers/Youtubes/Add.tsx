import { useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { IYoutubeItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { CREATE_YOUTUBE } from 'src/graphql/mutation/youtubes.mutation';

export const AddYoutube = () => {
  const route = useRouter();
  const sequence = _get(route, 'query.sequence', 1);
  const [creatYoutube, { loading, error }] = useMutation(CREATE_YOUTUBE);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IYoutubeItem) => {
    await creatYoutube({
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
      <PageHeader onBack={() => route.back()} icon title="URL" subTitle="Add new" />
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
          <Form.Item name="title" required label="Title">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="code" required label="Code">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="url" required label="URL">
            <Input placeholder="" required />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
