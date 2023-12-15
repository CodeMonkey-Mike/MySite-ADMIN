import { useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { ISkillItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { CREATE_SKILL } from 'src/graphql/mutation/skills.mutation';
import { useRouter } from 'next/router';

export const AddSkill = () => {
  const route = useRouter();
  const sequence = _get(route, 'query.sequence', 1);
  const [creatSkill, { loading, error }] = useMutation(CREATE_SKILL);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 3,
      span: 14,
    },
  };
  const onFinish = async (values: ISkillItem) => {
    await creatSkill({
      variables: {
        ...values,
        strength: Number(values.strength),
        sequence: Number(sequence),
      },
    });
    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="My Skills" subTitle="Add new" />
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
