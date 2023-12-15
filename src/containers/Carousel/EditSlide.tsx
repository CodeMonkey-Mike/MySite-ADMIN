import { useEffect, useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Button, Form, Input, Space, Spin, message } from 'antd';
import { ICarouselSlideItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { UPDATE_CAROUSEL_SLIDE } from 'src/graphql/mutation/carousel_slides.mutation';

export const EditCarouselSlide = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updatePoll, { loading, error }] = useMutation(UPDATE_CAROUSEL_SLIDE);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: ICarouselSlideItem) => {
    await updatePoll({
      variables: {
        ...values,
        id: Number(id),
        hashtag: values.hashtag.toString(),
      },
    });
    route.back();
  };

  useEffect(() => {
    if (record) {
      const hashtag = (record.hashtag as string).split(',');
      form.setFieldsValue({
        ...record,
        hashtag,
      });
    }
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Carousel Slide" subTitle="Edit" />
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
          <Form.Item name="description" required label="Description">
            <Input.TextArea placeholder="" required />
          </Form.Item>
          <Form.Item name="sequence" required label="Sequence">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item label="Hashtag">
            <Form.List name="hashtag" sx={{ justifyItems: 'flex-start' }}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                      <Form.Item {...restField} name={name}>
                        <Input placeholder="Hashtag" style={{ minWidth: '300px' }} />
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
                      Add hashtag
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
