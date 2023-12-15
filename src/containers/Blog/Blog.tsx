import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { PlusOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import _truncate from 'lodash/truncate';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Link } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Button, Spin, message, Table, Image } from 'antd';
import { IBlogItem } from 'src/types';
import { ALL_BLOG } from 'src/graphql/query/blog.query';
import { DELETE_BLOG } from 'src/graphql/mutation/blog.mutation';
import { P } from 'src/atoms';

const categories = {
  marketing: 'Marketing',
  engineering: 'Engineering',
  finance: 'Finance',
};

export const Blog = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<IBlogItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(ALL_BLOG);
  const [deleteProcess] = useMutation(DELETE_BLOG);
  const posts = _get(data, 'getAllPosts.posts', []);

  const add = () => {
    route.push({
      pathname: `/blog/add`,
    });
  };
  const edit = (record: IBlogItem) => {
    route.push({
      pathname: `/blog/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IBlogItem) => {
    await deleteProcess({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(posts);
  }, [posts]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (_: any, record: IBlogItem) => (
        <Link onClick={() => edit(record)} sx={{ textDecoration: 'underline' }}>
          {record.title}
        </Link>
      ),
      width: 300,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      render: (_: any, record: IBlogItem) => (
        <P
          filterImg
          dangerouslySetInnerHTML={{
            __html: _truncate(record.content, { length: 150 }),
          }}
        />
      ),
      width: 400,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_: any, record: IBlogItem) => {
        return <P>{record.status}</P>;
      },
      width: 150,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (_: any, record: IBlogItem) => {
        return <P>{categories[record.category]}</P>;
      },
      width: 150,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (_: any, record: IBlogItem) => {
        return record.image !== 'null' ? <Image src={record.image} width={150} /> : <></>;
      },
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IBlogItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Blog"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add New Post
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table pagination={false} columns={columns} dataSource={dataSource} />
      </Spin>
    </Box>
  );
};
