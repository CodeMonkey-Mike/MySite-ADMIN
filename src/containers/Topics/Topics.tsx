import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import _omit from 'lodash/omit';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Spin, message, Table, Button } from 'antd';
import { ITopicItem } from 'src/types';
import { DELETE_TOPICS } from 'src/graphql/mutation/topics.mutation';
import { TOPICS } from 'src/graphql/query/topics.query';
import { PlusOutlined } from '@ant-design/icons';

export const Topics = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<ITopicItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(TOPICS);
  const [deleteNewsletter] = useMutation(DELETE_TOPICS);
  const topics = _get(data, 'getNewsletterTopics.newsletterTopics', []);

  const add = () => {
    route.push({
      pathname: `/topics/add`,
    });
  };

  const edit = (record: ITopicItem) => {
    route.push({
      pathname: `/topics/${record.id}/edit`,
      query: {
        ..._omit(record, '__typename'),
      },
    });
  };
  const remove = async (record: ITopicItem) => {
    await deleteNewsletter({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(topics);
  }, [topics]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: ITopicItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Newsletter Topics"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Topic
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table pagination={false} columns={columns} dataSource={dataSource} />
      </Spin>
    </Box>
  );
};
