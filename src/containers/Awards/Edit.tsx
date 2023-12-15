import { useEffect, useCallback, useState, useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Button, Spin, message, Upload, Image, DatePicker } from 'antd';
import { IAwardItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import { UPDATE_AWARD } from 'src/graphql/mutation/awards.mutation';
import { useRouter } from 'next/router';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

export const EditAward = () => {
  const route = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [preview, setPreview] = useState('');
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updateAward, { loading, error }] = useMutation(UPDATE_AWARD);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IAwardItem) => {
    await updateAward({
      variables: {
        ..._omit(values, ['image']),
        id: Number(id),
        file: _get(values, 'image.fileList[0].originFileObj', undefined),
      },
    });
    route.back();
  };

  useEffect(() => {
    record &&
      form.setFieldsValue({
        ...record,
        awardTime: moment(record.awardTime, 'YYYY-MM'),
      });
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);
  // @ts-ignore
  useMemo(() => record && setPreview(record.image), [record]);

  const onUpload = useCallback(
    (upload) => {
      if (!!upload.fileList.length) {
        setDisabled(true);
        setPreview(upload.file.url);
      } else {
        setDisabled(false);
        // @ts-ignore
        setPreview(record.image);
      }
    },
    [record]
  );

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Award" subTitle="Edit" />
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
          {preview && (
            <Form.Item {...tailLayout}>
              <Image src={preview} />
            </Form.Item>
          )}
          <Form.Item name="image" required label="Award Image">
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
