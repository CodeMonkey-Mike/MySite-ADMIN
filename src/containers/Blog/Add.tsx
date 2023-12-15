import _omit from 'lodash/omit';
import _get from 'lodash/get';
import _sort from 'lodash/sortBy';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Spin, message, Upload, Button, Select, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Box } from '@theme-ui/components';
import { CodeEditor, PageHeader, SubmitButton } from 'src/components';
import { useMutation, useQuery } from '@apollo/client';
import { useQuill } from 'react-quilljs';
import { IBlogItem } from 'src/types';
import { CREATE_BLOG } from 'src/graphql/mutation/blog.mutation';
import { UPLOAD_FILE } from 'src/graphql/mutation/file.mutation';
import { TAGS } from 'src/graphql/query/tags.query';
import styled from 'styled-components';
import 'quill/dist/quill.snow.css';
import { BlogStatuses, BlogStatus } from 'src/interfaces';

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

export const AddBlog = () => {
  const route = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [activeEditor, setActiveEditor] = useState('rich-editor');
  const [createPost, { loading, error }] = useMutation(CREATE_BLOG);
  const { data, loading: tagLoading } = useQuery(TAGS);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  // const [deleteFile] = useMutation(DELETE_FILE);
  const [form] = Form.useForm();
  // const [ids, setIds] = useState([]);
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
  const onFinish = async (values: IBlogItem) => {
    await createPost({
      variables: {
        ..._omit(values, ['image']),
        editor_type: activeEditor,
        content: activeEditor === 'rich-editor' ? quill.root.innerHTML : editorHtml,
        tags: JSON.stringify(values.tags) || null,
        file: _get(values, 'image.fileList[0].originFileObj'),
      },
    });
    // setIds([]);
    route.back();
  };

  const tags = useMemo(
    () =>
      _get(data, 'getTags.tags')?.map((item: { title: string; slug: string }) => ({
        value: item.slug,
        label: item.title,
      })) || [],
    [data]
  );

  useMemo(() => error?.message && message.error(error?.message), [error]);

  const onUpload = useCallback((upload) => {
    if (!!upload.fileList.length) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, []);

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
          const id = _get(data, 'uploadFile.file.id');
          console.log('id:', id);
          // if (id) {
          //   setIds((state) => [...state, id]);
          // }
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

  // useEffect(() => {
  //   return () => {
  //     if (!!ids.length) {
  //       deleteFile({
  //         variables: {
  //           ids,
  //         },
  //       });
  //     }
  //   };
  // }, [ids]);

  const [editorHtml, setEditorHtml] = useState('');
  // const onGetHtml = () => {
  //   const html = quill.root.innerHTML;
  //   setShowHtmlEditor(true);
  //   setEditorHtml(html);
  // };
  // const onShowEditor = () => {
  //   setShowHtmlEditor(false);
  // };

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Post" subTitle="Add new" />
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
              // onChange={handleChange}
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
