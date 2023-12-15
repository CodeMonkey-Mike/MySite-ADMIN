import { useMemo } from 'react';
import { Box, Link } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { IProcessItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { CREATE_PROCESS } from 'src/graphql/mutation/processes.mutation';
import { P } from 'src/atoms';

export const AddProcess = () => {
  const route = useRouter();
  const sequence = _get(route, 'query.sequence', 1);
  const [creatProcess, { loading, error }] = useMutation(CREATE_PROCESS);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IProcessItem) => {
    await creatProcess({
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
      <PageHeader onBack={() => route.back()} icon title="Process" subTitle="Add new" />
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
          <Form.Item name="name" required label="Process name">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="icon" required label="Font-Awesome class name">
            <Input placeholder="" required />
          </Form.Item>
          <P margin="5px 0 0">
            <Link href="https://fontawesome.com/icons?d=gallery&p=2&m=free" target="_blank">
              Reference
            </Link>{' '}
          </P>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
