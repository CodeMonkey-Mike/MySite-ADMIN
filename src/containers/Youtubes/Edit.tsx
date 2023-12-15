import { useEffect, useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { IYoutubeItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { UPDATE_YOUTUBE } from 'src/graphql/mutation/youtubes.mutation';
import { useRouter } from 'next/router';

export const EditYoutube = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updateYoutube, { loading, error }] = useMutation(UPDATE_YOUTUBE);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IYoutubeItem) => {
    await updateYoutube({
      variables: {
        ...values,
        id: Number(id),
        sequence: Number(record.sequence),
      },
    });
    route.back();
  };

  useEffect(() => {
    record &&
      form.setFieldsValue({
        ...record,
      });
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="URL" subTitle="Edit" />
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
