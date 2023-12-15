import { useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Select, Spin, message } from 'antd';
import { ICarouselTopicItem } from 'src/types';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CREATE_CAROUSEL_TOPICS } from 'src/graphql/mutation/carousel_topics.mutation';

export const AddCarouselTopic = () => {
  const route = useRouter();
  const [createTopic, { loading, error }] = useMutation(CREATE_CAROUSEL_TOPICS);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: ICarouselTopicItem) => {
    await createTopic({
      variables: {
        ...values,
      },
    });
    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Carousel Topics" subTitle="Add new" />
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
          <Form.Item
            name="topic"
            required
            label="Topic"
            rules={[
              {
                required: true,
                message: 'The topic is required!',
              },
            ]}
          >
            <Select placeholder="Please select">
              <Select.Option value="Stocks">Stocks</Select.Option>
              <Select.Option value="Stock market">Stock market</Select.Option>
              <Select.Option value="Entrepreneurship">Entrepreneurship</Select.Option>
              <Select.Option value="Building wealth">Building wealth</Select.Option>
              <Select.Option value="Motivation">Motivation</Select.Option>
              <Select.Option value="Productivity">Productivity</Select.Option>
              <Select.Option value="Self improvement">Self improvement</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" required label="Content">
            <Input.TextArea rows={15} placeholder="" required size="large" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
