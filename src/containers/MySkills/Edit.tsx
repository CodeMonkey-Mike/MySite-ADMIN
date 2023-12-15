import { useEffect, useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { ISkillItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { UPDATE_SKILL } from 'src/graphql/mutation/skills.mutation';
import { useRouter } from 'next/router';

export const EditSkill = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updateSkill, { loading, error }] = useMutation(UPDATE_SKILL);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 3,
      span: 14,
    },
  };
  const onFinish = async (values: ISkillItem) => {
    await updateSkill({
      variables: {
        ...values,
        id: Number(id),
        strength: Number(values.strength),
        sequence: Number(record.sequence),
      },
    });
    route.back();
  };

  useEffect(() => {
    record &&
      form.setFieldsValue({
        name: record.name,
        strength: record.strength,
      });
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="My Skills" subTitle="Edit" />
      <Spin spinning={loading} tip="Loading...">
        <Form
          layout="horizontal"
          form={form}
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="name" required label="Name">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="strength" required label="Strength">
            <Input placeholder="" required type="number" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
