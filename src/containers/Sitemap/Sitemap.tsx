import { Box } from '@theme-ui/components';
import { Form, Input, Spin, message } from 'antd';
import { PageHeader, SubmitButton } from 'src/components';
import { useQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';
import _get from 'lodash/get';
import { SITEMAP } from 'src/graphql/query/sitemap.query';
import { UPDATE_SITEMAP } from 'src/graphql/mutation/sitemap.mutation';

const tailLayout = {
  wrapperCol: { offset: 3, span: 14 },
};
const { TextArea } = Input;
export const Sitemap = () => {
  const { loading, error, data, refetch } = useQuery(SITEMAP);
  const [updateSitemap, { loading: updateLoading }] = useMutation(UPDATE_SITEMAP);
  const [form] = Form.useForm();

  const onFinish = useCallback(async (values: { sitemap: string }) => {
    await updateSitemap({
      variables: {
        id: 1,
        sitemap: values.sitemap,
      },
    });
    message.success('Update successfully!');
  }, []);

  useMemo(() => error?.message && message.error(error?.message), [error]);
  const sitemap = useMemo(() => _get(data, 'getSiteMap'), [data]);

  useEffect(() => {
    if (sitemap) {
      form.setFieldsValue({
        sitemap,
      });
    }
  }, [form, sitemap, data]);

  useEffect(() => {
    refetch({ id: 1 });
  }, [refetch]);

  return (
    <Box>
      <PageHeader title="Sitemap" />
      <Spin spinning={loading || updateLoading} tip="Loading...">
        <Form
          layout="horizontal"
          form={form}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
        >
          <Form.Item name="sitemap" label="Content">
            <TextArea placeholder="Please enter sitemap under JSON." rows={20} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Save" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
