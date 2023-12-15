import { useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { ITestimonialItem } from 'src/types';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CREATE_TESTIMONIAL } from 'src/graphql/mutation/testimonials.mutation';

export const AddNewsletter = () => {
  const route = useRouter();
  const [creatTestimonial, { loading, error }] = useMutation(CREATE_TESTIMONIAL);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: ITestimonialItem) => {
    await creatTestimonial({
      variables: {
        ...values,
      },
    });
    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Testimonial" subTitle="Add new" />
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
          <Form.Item name="company" required label="Company">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="quote" required label="Quote">
            <Input.TextArea rows={5} placeholder="" required />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
