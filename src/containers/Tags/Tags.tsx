import { Box } from '@theme-ui/components';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Spin, message, Button, Tag as BaseTag, InputRef } from 'antd';
import { PageHeader } from 'src/components';
import { useEffect, useMemo, useRef, useState } from 'react';
import TweenOneGroup from 'rc-tween-one/lib/TweenOneGroup';
import _get from 'lodash/get';
import _kebabCase from 'lodash/lowerCase';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TAG, DELETE_TAG } from 'src/graphql/mutation/tags.mutation';
import { TAGS } from 'src/graphql/query/tags.query';

const Tag = styled(BaseTag)`
  padding: 5px 12px;
  font-size: 14px;
  svg {
    color: #fff;
  }
`;

export const Tags = () => {
  const { data, loading, refetch } = useQuery(TAGS);
  const [CreateTag, { loading: createLoading }] = useMutation(CREATE_TAG);
  const [DeletTag, { loading: deleteLoading }] = useMutation(DELETE_TAG);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  const tagList = useMemo(() => _get(data, 'getTags.tags') || [], [data]);
  const tags = useMemo(
    () => _get(data, 'getTags.tags')?.map((tag: { title: string }) => tag.title) || [],
    [data]
  );

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);

  const onRemove = async (removedTag: string) => {
    const tagItem = tagList.find(
      (tag: { title: string }) => _kebabCase(tag.title) === _kebabCase(removedTag)
    );
    if (tagItem) {
      await DeletTag({
        variables: {
          id: tagItem.id,
        },
      });
    }
    await refetch();
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onBlur = () => {
    setInputVisible(false);
    setInputValue('');
  };

  const handleInputConfirm = async () => {
    if (!inputValue) {
      return message.warning('Tag name should not empty!');
    }
    const duplicated = tagList.find(
      (tag: { title: string }) => _kebabCase(tag.title) === _kebabCase(inputValue)
    );
    if (duplicated && duplicated.title) {
      return message.warning('Tag is duplicated!');
    }
    await CreateTag({
      variables: {
        title: inputValue,
      },
    });
    await refetch();
    onBlur();
  };

  const tagChild = useMemo(
    () =>
      !!tags.length
        ? tags.map((tag: string) => {
            const tagElem = (
              <Tag
                key={tag}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  onRemove(tag);
                }}
                style={{
                  background: '#1890ff',
                  borderRadius: '20px',
                  color: '#fff',
                }}
              >
                {tag}
              </Tag>
            );
            return (
              <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
              </span>
            );
          })
        : [],
    [tags]
  );

  const tagPlusStyle = {
    background: '#eee',
    borderStyle: 'dashed',
    borderRadius: '20px',
  };

  return (
    <Box>
      <PageHeader title="Tags" />
      <Spin spinning={loading || createLoading || deleteLoading} tip="Loading...">
        <Box style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
            }}
            onEnd={(e) => {
              if (e.type === 'appear' || e.type === 'enter') {
                (e.target as any).style = 'display: inline-block';
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </Box>
        {inputVisible ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{ width: 150 }}
              value={inputValue}
              onChange={handleInputChange}
              // onBlur={onBlur}
              onPressEnter={handleInputConfirm}
            />
            <Button type="primary" onClick={handleInputConfirm}>
              Add
            </Button>
          </Box>
        ) : (
          <Box>
            <Button onClick={showInput} style={tagPlusStyle}>
              <PlusOutlined /> New Tag
            </Button>
          </Box>
        )}
      </Spin>
    </Box>
  );
};
