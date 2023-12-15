import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message } from 'antd';
import { IVideo } from 'src/types';
import { useQuery, useMutation } from '@apollo/client';
import { VIDEO } from 'src/graphql/query/video.query';
import { UPDATE_VIDEO, CREATE_VIDEO } from 'src/graphql/mutation/video.mutation';
import { useEffect, useMemo } from 'react';
import _get from 'lodash/get';

export const Video = () => {
  const { loading, error, data, refetch } = useQuery(VIDEO);
  const [updateProfile, { loading: mutationLoading }] = useMutation(UPDATE_VIDEO);
  const [createProfile] = useMutation(CREATE_VIDEO);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: { offset: 3, span: 14 },
  };
  const video = _get(data, 'getVideo.video', null);
  const onFinish = async (values: IVideo) => {
    if (video) {
      await updateProfile({ variables: { ...values, id: video.id } });
    } else {
      await createProfile({ variables: { ...values } });
    }
    await refetch();
  };
  useEffect(() => {
    refetch({ id: 1 });
  }, [refetch]);
  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    video && form.setFieldsValue({ ...video });
  }, [form, video]);

  return (
    <Box>
      <PageHeader title="Video" />
      <Spin spinning={loading || mutationLoading} tip="Loading...">
        <Form
          layout="horizontal"
          form={form}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
        >
          <Form.Item required name="title" label="Title">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="url" label="URL" required>
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Save" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
