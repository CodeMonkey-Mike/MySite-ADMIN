import { useCallback, useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Button, Spin, message, Upload, DatePicker } from 'antd';
import { IAwardItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import { useRouter } from 'next/router';
import { CREATE_AWARD } from 'src/graphql/mutation/awards.mutation';
import { UploadOutlined } from '@ant-design/icons';

export const AddAward = () => {
  const route = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [creatAward, { loading, error }] = useMutation(CREATE_AWARD);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IAwardItem) => {
    await creatAward({
      variables: {
        ..._omit(values, ['image']),
        file: _get(values, 'image.fileList[0].originFileObj'),
      },
    });
    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);
  const onUpload = useCallback((upload) => {
    if (!!upload.fileList.length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, []);
  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Award" subTitle="Add new" />
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
          <Form.Item name="company" required label="Company">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="awardTime" required label="Award Time">
            <DatePicker picker="month" />
          </Form.Item>
          <Form.Item name="image" required label="Image">
            <Upload
              className="upload-list-inline"
              listType="picture"
              multiple={false}
              onChange={onUpload}
            >
              <Button disabled={disabled} icon={<UploadOutlined />}>
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
