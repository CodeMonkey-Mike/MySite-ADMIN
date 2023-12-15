import { useCallback, useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Button, Spin, message, Upload } from 'antd';
import { IServiceItem } from 'src/types';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CREATE_SERVICE } from 'src/graphql/mutation/services.mutation';
import { UploadOutlined } from '@ant-design/icons';

export const AddService = () => {
  const route = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [creatService, { loading, error }] = useMutation(CREATE_SERVICE);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IServiceItem) => {
    await creatService({
      variables: {
        name: values.name,
        // @ts-ignore
        file: values.image.fileList[0].originFileObj,
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
      <PageHeader onBack={() => route.back()} icon title="Service" subTitle="Add new" />
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
          <Form.Item name="name" required label="Service name">
            <Input placeholder="" required />
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
