import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Button, Form, Input, Select, Space, Spin, message } from 'antd';
import { IPollItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { UPDATE_POLL } from 'src/graphql/mutation/poll.mutation';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const EditPoll = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updatePoll, { loading, error }] = useMutation(UPDATE_POLL);
  const [form] = Form.useForm();
  const [network, setNetwork] = useState('');
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IPollItem) => {
    if (!values.options.length) {
      return message.error('Options is required!');
    }
    await updatePoll({
      variables: {
        ...values,
        id: Number(id),
        options: values.options.toString(),
      },
    });
    route.back();
  };

  const onNetWorkChange = useCallback((value: string) => {
    setNetwork(value);
  }, []);

  const charLimitValidation = useMemo(() => {
    if (network === 'linkedin') {
      return { max: 30, message: 'The maximum length is 30 characters.' };
    }
    return { max: 25, message: 'The maximum length is 25 characters.' };
  }, [network]);

  useEffect(() => {
    if (record) {
      setNetwork(record.category as string);
      const options = (record.options as string).split(',');
      form.setFieldsValue({
        ...record,
        options,
      });
    }
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Poll" subTitle="Edit" />
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
          <Form.Item name="topic" required label="Topic">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="category" required label="Network">
            <Select onChange={onNetWorkChange} placeholder="Please select">
              <Select.Option value="linkedin">LinkedIn</Select.Option>
              <Select.Option value="twitter">Twitter</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Options" required>
            <Form.List name="options" sx={{ justifyItems: 'flex-start' }}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={name}
                        required
                        rules={[
                          { required: true, message: 'Option is required!' },
                          charLimitValidation,
                        ]}
                      >
                        <Input placeholder="Option" style={{ minWidth: '300px' }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item
                    wrapperCol={{
                      span: 6,
                    }}
                  >
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add option
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
