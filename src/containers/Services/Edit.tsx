// @ts-nocheck
import { useEffect, useCallback, useState, useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Button, Spin, message, Upload, Image } from 'antd';
import { IServiceItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import { UPDATE_SERVICE } from 'src/graphql/mutation/services.mutation';
import { useRouter } from 'next/router';
import { UploadOutlined } from '@ant-design/icons';

export const EditService = () => {
  const route = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [preview, setPreview] = useState('');
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updateService, { loading, error }] = useMutation(UPDATE_SERVICE);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IServiceItem) => {
    if (!values.image.fileList) {
      return message.error('Please edit the info before submit.');
    }
    await updateService({
      variables: {
        id: Number(id),
        name: values.name,
        file: values.image.fileList[0].originFileObj,
      },
    });
    route.back();
  };

  useEffect(() => {
    record &&
      form.setFieldsValue({
        name: record.name,
        image: record.image,
      });
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);
  useMemo(() => record && setPreview(record.image), [record]);

  const onUpload = useCallback(
    (upload) => {
      if (!!upload.fileList.length) {
        setDisabled(true);
        setPreview(upload.file.url);
      } else {
        setDisabled(false);
        setPreview(record.image);
      }
    },
    [record]
  );

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="My Service" subTitle="Edit" />
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
          {preview && (
            <Form.Item {...tailLayout}>
              <Image src={preview} />
            </Form.Item>
          )}
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
