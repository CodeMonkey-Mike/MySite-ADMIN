import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _sort from 'lodash/sortBy';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { CodeEditor, PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message, Upload, Button, Image, Select, Radio } from 'antd';
import { useQuill } from 'react-quilljs';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { UPDATE_BLOG } from 'src/graphql/mutation/blog.mutation';
import styled from 'styled-components';
import 'quill/dist/quill.snow.css';
import { DELETE_FILE, UPLOAD_FILE } from 'src/graphql/mutation/file.mutation';
import { IBlogItem } from 'src/types';
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { TAGS } from 'src/graphql/query/tags.query';
import { BlogStatus, BlogStatuses } from 'src/interfaces';

// const beautifyHtml = require('js-beautify').html;

const EditorContainer = styled(Box)`
  border: 1px solid #ccc;
  min-height: 500px;
  .ql-container.ql-snow {
    border: none;
  }
  .ql-toolbar.ql-snow {
    border: none;
    border-bottom: 1px solid #ccc;
  }
  .ql-editor img,
  .ql-snow .ql-editor img {
    width: 70%;
    max-width: 600px;
  }
`;

export const EditBlog = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [activeEditor, setActiveEditor] = useState(record?.editor_type ?? 'rich-editor');
  const [disabled, setDisabled] = useState(false);
  const [preview, setPreview] = useState('');
  const [updatePost, { loading, error }] = useMutation(UPDATE_BLOG);
  const { data, loading: tagLoading } = useQuery(TAGS);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [deleteFile] = useMutation(DELETE_FILE);
  const [form] = Form.useForm();
  const [ids, setIds] = useState([]);
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    },
    placeholder: 'Write your content here...',
  });

  const tags = useMemo(
    () =>
      _get(data, 'getTags.tags')?.map((item: { title: string; slug: string }) => ({
        value: item.slug,
        label: item.title,
      })) || [],
    [data]
  );

  const onFinish = async (values: IBlogItem) => {
    await updatePost({
      variables: {
        ..._omit(values, ['image']),
        id: Number(id),
        editor_type: activeEditor,
        content: activeEditor === 'rich-editor' ? quill.root.innerHTML : editorHtml,
        tags: JSON.stringify(values.tags) || null,
        file: _get(values, 'image.fileList[0].originFileObj', undefined),
      },
    });
    setIds([]);
    route.back();
  };

  useEffect(() => {
    if (record && quill) {
      const { content } = record;
      if (record?.editor_type === 'rich-editor') {
        // @ts-ignore
        quill.root.innerHTML = content;
      } else {
        // @ts-ignore
        setEditorHtml(content);
      }
      form.setFieldsValue({
        ...record,
        // @ts-ignore
        tags: !!record.tags ? JSON.parse(record.tags) : [],
      });
    }
  }, [quill, form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  const imageHandler = async () => {
    if (document) {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        const file: any = input && input.files ? input.files[0] : null;
        const formData = new FormData();
        formData.append('file', file);
        try {
          const { data } = await uploadFile({
            variables: {
              file,
            },
          });
          const path = _get(data, 'uploadFile.file.path');
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', path);
        } catch (_) {}
      };
    }
  };

  useEffect(() => {
    if (quill) {
      // Add custom handler for Image Upload
      quill.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, [quill]);

  useEffect(() => {
    return () => {
      if (!!ids.length) {
        deleteFile({
          variables: {
            ids,
          },
        });
      }
    };
  }, [ids]);

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

  const [editorHtml, setEditorHtml] = useState('');
  // const onGetHtml = () => {
  //   const html = quill.root.innerHTML;
  //   setShowHtmlEditor(true);
  //   setEditorHtml(html);
  // };
  // const onShowEditor = () => {
  //   setShowHtmlEditor(false);
  // };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const onViewPost = () => {
    const location =
      typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '';
    if (location) {
      if (location.includes('localhost')) {
        return openInNewTab(`http://localhost:3001/blog/${record?.slug}`);
      }
      if (location.includes('staging.admin') || location.includes('qa')) {
        return openInNewTab(`http://staging.mikeneder.me/blog/${record?.slug}`);
      }
      return openInNewTab(`https://mikeneder.me/blog/${record?.slug}`);
    }
  };

  return (
    <Box>
      <PageHeader
        onBack={() => route.back()}
        icon
        title="Post"
        subTitle="Edit"
        extra={[
          <Button
            onClick={() => onViewPost()}
            type="primary"
            icon={<EyeOutlined />}
            style={{ marginRight: 10 }}
          >
            View Post
          </Button>,
        ]}
      />
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
          <Form.Item name="anchor_title" required label="Anchor title">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="slug" required label="Slug">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="author" required label="Author">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="category" required label="Category">
            <Select placeholder="Please select">
              <Select.Option value="marketing">Marketing</Select.Option>
              <Select.Option value="engineering">Engineering</Select.Option>
              <Select.Option value="finance">Finance</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="image" required label="Feature Image">
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
          {preview && preview !== 'null' && (
            <Form.Item
              wrapperCol={{
                offset: 5,
                span: 5,
              }}
            >
              <Image src={preview} />
            </Form.Item>
          )}
          <Form.Item {...tailLayout}>
            <Radio.Group
              name="editor-selection"
              defaultValue={activeEditor}
              onChange={(e) => setActiveEditor(e.target.value)}
            >
              <Radio value="rich-editor">WYSIWYG</Radio>
              <Radio value="code-editor">Code Editor</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="content"
            required
            label="Content"
            hidden={activeEditor !== 'code-editor'}
          >
            <CodeEditor
              // @ts-ignore
              id="CodeEditor"
              value={editorHtml}
              language="html"
              placeholder="Please enter HTML code."
              onChange={(evn) => {
                quill.root.innerHTML = evn.target.value;
                setEditorHtml(evn.target.value);
              }}
              padding={15}
              minHeight={500}
              style={{
                border: '1px solid #ccc',
                fontSize: 12,
                backgroundColor: '#ffffff',
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
            />
          </Form.Item>
          <Form.Item
            name="content"
            required
            label="Content"
            hidden={activeEditor !== 'rich-editor'}
          >
            <EditorContainer backgroundColor="white">
              <div ref={quillRef} />{' '}
            </EditorContainer>
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select
              loading={tagLoading}
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select tag"
              options={_sort(tags, (o) => {
                return o.label;
              })}
            />
          </Form.Item>
          <Form.Item name="status" required label="Status">
            <Select
              defaultValue={BlogStatus.PUBLIC}
              style={{ width: '100%' }}
              options={BlogStatuses}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
