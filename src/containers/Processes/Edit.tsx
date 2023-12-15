import { useEffect, useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { IProcessItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { UPDATE_PROCESS } from 'src/graphql/mutation/processes.mutation';
import { useRouter } from 'next/router';

export const EditProcess = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updateProcess, { loading, error }] = useMutation(UPDATE_PROCESS);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IProcessItem) => {
    await updateProcess({
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
        name: record.name,
        icon: record.icon,
      });
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="My Processs" subTitle="Edit" />
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
          <Form.Item name="name" required label="Name">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="icon" required label="FontAwesome class name">
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
