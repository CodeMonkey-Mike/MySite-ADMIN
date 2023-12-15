import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Button, Spin, message, Select, Upload, Image } from 'antd';
import { IPortfolioItem } from 'src/types';
import { useMutation, useQuery } from '@apollo/client';
import _get from 'lodash/get';
import _pick from 'lodash/pick';
import _omit from 'lodash/omit';
import { UPDATE_PORTFOLIO } from 'src/graphql/mutation/portfolios.mutation';
import { useRouter } from 'next/router';
import { UploadOutlined } from '@ant-design/icons';
import { PHOTOS } from 'src/graphql/query/photos.query';

const defaultFileList = (images) => {
  if (!images.length) return [];
  return images.map((image, idx) => ({
    ...image,
    uid: `-${idx + 1}`,
    name: image.url,
    status: 'done',
    url: image.url,
    thumbUrl: image.url,
  }));
};

export const EditPortfolio = () => {
  const route = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [preview, setPreview] = useState('');
  const [galleries, setGalleries] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updatePortfolio, { loading, error }] = useMutation(UPDATE_PORTFOLIO);
  const { refetch } = useQuery(PHOTOS, {
    skip: true,
  });
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const onFinish = async (values: IPortfolioItem) => {
    const gl = _get(values, 'gallery.fileList', []).filter((f) => f.originFileObj) || null;
    const fgl = gl?.map((g) => g.originFileObj) || null;
    await updatePortfolio({
      variables: {
        ..._omit({ ...values }, ['logo']),
        // @ts-ignore
        file: values.logo.fileList ? values.logo.fileList[0].originFileObj : undefined,
        gallery: fgl,
        deleted_gl: !!deletedPhotos.length ? deletedPhotos : null,
        id: Number(id),
        sequence: Number(record.sequence),
      },
    });
    route.back();
  };

  const init = useCallback(async () => {
    const resp = await refetch({
      parent_id: Number(record.id),
      category: 'portfolio',
    });
    // setGalleries(resp.data.getPhoto.photos || []);
    const list = defaultFileList(resp.data.getPhoto.photos);

    setGalleries(list);
  }, [record, refetch]);

  useEffect(() => {
    if (record) {
      init();
      form.setFieldsValue({
        ...Object.fromEntries(Object.entries(record).filter(([, v]) => v !== 'null')),
        logo: record.logo,
      });
    }
  }, [record, form, init]);

  useMemo(() => error?.message && message.error(error?.message), [error]);
  // @ts-ignore
  useMemo(() => record && setPreview(record.logo), [record]);

  const onUpload = useCallback(
    (upload) => {
      if (!!upload.fileList.length) {
        setDisabled(true);
        setPreview(upload.file.url);
      } else {
        setDisabled(false);
        // @ts-ignore
        setPreview(record.logo);
      }
    },
    [record]
  );

  const onRemove = useCallback(
    (file) => {
      setDeletedPhotos([...deletedPhotos, _pick(file, ['category', 'id', 'parent_id'])]);
    },
    [deletedPhotos]
  );

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="My Portfolios" subTitle="Edit" />
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
          {preview && (
            <Form.Item {...tailLayout}>
              <Image src={preview} width={200} />
            </Form.Item>
          )}
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
          {!!galleries.length && (
            <Form.Item name="gallery" label="Slide Show Images">
              <Upload
                className="upload-list-inline"
                listType="picture"
                multiple={true}
                defaultFileList={[...galleries]}
                onRemove={onRemove}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          )}
          {!galleries.length && (
            <Form.Item name="gallery" label="Slide Show Images">
              <Upload className="upload-list-inline" listType="picture" multiple={true}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item name="detail" label="Detail">
            <Input.TextArea placeholder="" rows={5} />
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
