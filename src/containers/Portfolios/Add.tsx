import { useCallback, useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Button, Spin, message, Select, Upload } from 'antd';
import { IPortfolioItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import { useRouter } from 'next/router';
import { CREATE_PORTFOLIO } from 'src/graphql/mutation/portfolios.mutation';
import { UploadOutlined } from '@ant-design/icons';

export const AddPortfolio = () => {
  const [disabled, setDisabled] = useState(false);
  const route = useRouter();
  const sequence = _get(route, 'query.sequence', 1);
  const [creatPortfolio, { loading, error }] = useMutation(CREATE_PORTFOLIO);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IPortfolioItem) => {
    const gl = _get(values, 'gallery.fileList', []).map((f) => f.originFileObj) || null;

    await creatPortfolio({
      variables: {
        ..._omit({ ...values }, ['logo']),
        file: _get(values, 'logo.fileList[0].originFileObj', null),
        gallery: gl,
        sequence: Number(sequence),
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
      <PageHeader onBack={() => route.back()} icon title="Portfolio" subTitle="Add new" />
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
          <Form.Item name="type" required label="Type">
            <Select placeholder="Please select">
              <Select.Option value="brands">Brands</Select.Option>
              <Select.Option value="social-platforms">Social platforms</Select.Option>
              <Select.Option value="tools/services">Tools/Services</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="logo" required label="Logo">
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

          <Form.Item name="client" required label="Client">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="description" required label="Client Description">
            <Input.TextArea placeholder="" required rows={7} />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="url" label="URL">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            name="year"
            wrapperCol={{
              offset: 0,
              span: 5,
            }}
            label="Year"
          >
            <Input placeholder="" />
          </Form.Item>

          <Form.Item name="gallery" label="Slide Show Images">
            <Upload className="upload-list-inline" listType="picture" multiple={true}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="detail" label="Detail">
            <Input.TextArea placeholder="" />
          </Form.Item>
          <Form.Item name="facebook" label="Facebook">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="twitter" label="Twitter">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="pinterest" label="Pinterest">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="linkedin" label="Linkedin">
            <Input placeholder="" />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
