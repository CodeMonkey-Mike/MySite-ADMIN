import { Box } from '@theme-ui/components';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Spin, message, Upload, Button, Checkbox } from 'antd';
import { PageHeader, SubmitButton } from 'src/components';
import { IAboutMe } from 'src/types';
import { useQuery, useMutation } from '@apollo/client';
import { ABOUT_ME } from 'src/graphql/query/about.query';
import {
  UPDATE_PROFILE,
  UPLOAD_CV,
  UPLOAD_MEDIA_KIT,
  UPLOAD_SLIDER,
} from 'src/graphql/mutation/profile.mutation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _get from 'lodash/get';

const defaultFileList = (images) => {
  if (!images.length) return [];
  return images.map((image) => ({
    ...image,
    uid: image.uid,
    name: image.url,
    status: 'done',
    url: image.url,
    thumbUrl: image.url,
  }));
};

export const About = () => {
  const { loading, error, data, refetch } = useQuery(ABOUT_ME);
  const [UseUpdateProfile, { loading: mutationLoading }] = useMutation(UPDATE_PROFILE);
  const [UploadSlider, { loading: sliderLoading }] = useMutation(UPLOAD_SLIDER);
  const [form] = Form.useForm();
  const [sliderForm] = Form.useForm();
  const profile = _get(data, 'getProfile.profile', null);
  const tailLayout = {
    wrapperCol: { offset: 3, span: 14 },
  };
  const [uploadCV, { loading: cvLoading }] = useMutation(UPLOAD_CV);
  const [uploadMediaKit, { loading: mediaLoading }] = useMutation(UPLOAD_MEDIA_KIT);

  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  const onFinish = async (values: IAboutMe) => {
    Object.keys(values).length > 0 &&
      (await UseUpdateProfile({ variables: { ...values, id: profile?.id || undefined } }));

    await refetch({ id: 1 });
    message.success('Update successfully!');
  };
  useEffect(() => {
    refetch({ id: 1 });
  }, [refetch]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  const onCVUpload = useCallback(async (upload) => {
    if (!!upload.fileList.length) {
      const files = upload.fileList.filter((f) => f.uid !== '111');
      await uploadCV({
        variables: {
          id: 1,
          file: _get(files, '0.originFileObj'),
        },
      });
    }
  }, []);

  const onMediaKitUpload = useCallback(async (upload) => {
    if (!!upload.fileList.length) {
      const files = upload.fileList.filter((f) => f.uid !== '222');
      await uploadMediaKit({
        variables: {
          id: 1,
          file: _get(files, '0.originFileObj'),
        },
      });
    }
  }, []);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        ...Object.fromEntries(Object.entries(profile).filter(([, v]) => v !== 'null')),
      });
      if (profile.cv) {
        setFileList1(() => [
          {
            uid: '111',
            name: 'CV',
            status: 'done',
            url: profile.cv,
          },
        ]);
      }
      if (profile.media_kit) {
        setFileList2(() => [
          {
            uid: '222',
            name: 'Media Kit',
            status: 'done',
            url: profile.media_kit,
          },
        ]);
      }
      if (!!profile.slider_images) {
        const list = defaultFileList(JSON.parse(profile.slider_images));

        setGalleries(list);
      }
    }
  }, [form, profile]);

  const onRemove = useCallback(
    (file) => {
      setDeletedPhotos([...deletedPhotos, file.uid]);
    },
    [deletedPhotos]
  );

  const onSliderFinish = async (values: any) => {
    const gl = _get(values, 'gallery.fileList', []).filter((f) => f.originFileObj) || null;
    const fgl = gl?.map((g) => g.originFileObj) || null;
    await UploadSlider({
      variables: {
        id: 1,
        files: fgl,
        deleted_files: !!deletedPhotos.length ? deletedPhotos : null,
      },
    });
    await refetch({ id: 1 });
    message.success('Update slider successfully!');
  };

  return (
    <Box>
      <PageHeader title="Slider Images" />
      <Spin spinning={sliderLoading} tip="Loading...">
        <Form
          layout="horizontal"
          form={sliderForm}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 14 }}
          onFinish={onSliderFinish}
        >
          {!!galleries.length && (
            <Form.Item name="gallery" label="Images">
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
            <Form.Item name="gallery" label="Images">
              <Upload className="upload-list-inline" listType="picture" multiple={true}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Save" />
          </Form.Item>
        </Form>
      </Spin>
      <PageHeader title="About Me" />
      <Spin spinning={loading || mutationLoading} tip="Loading...">
        <Form
          layout="horizontal"
          form={form}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
        >
          <Form.Item name="name" label="Full Name">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="dob" label="Birthday">
            <Input placeholder="" />{' '}
          </Form.Item>
          <Form.Item name="birthPlace" label="Birth Place">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="web" label="Web">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="hobby" label="Hobbies">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="address" label="Address Line 1">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="address_1" label="Address Line 2">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input.TextArea placeholder="" rows={5} />
          </Form.Item>
          <Form.Item name="cv" label="CV">
            <Upload
              className="upload-list-inline"
              listType="text"
              multiple={false}
              onChange={onCVUpload}
              fileList={fileList1}
            >
              <Button disabled={cvLoading} icon={<UploadOutlined />}>
                Click to Upload CV
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="media_kit" label="Media Kit">
            <Upload
              className="upload-list-inline"
              listType="text"
              multiple={false}
              onChange={onMediaKitUpload}
              fileList={fileList2}
            >
              <Button disabled={mediaLoading} icon={<UploadOutlined />}>
                Click to Upload Media Kit
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="hide_experience" {...tailLayout} valuePropName="checked">
            <Checkbox defaultChecked={true}>Hide Experience</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Save" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
