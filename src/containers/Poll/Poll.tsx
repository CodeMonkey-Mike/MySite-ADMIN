import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { PlusOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Button, Spin, message, Table } from 'antd';
import { IPollItem } from 'src/types';
import { DELETE_POLL } from 'src/graphql/mutation/poll.mutation';
import { POLL } from 'src/graphql/query/poll.query';
import { format } from 'date-fns';

export const Poll = () => {
  const route = useRouter();
  const { loading, error, data, refetch } = useQuery(POLL);
  const [deletePoll] = useMutation(DELETE_POLL);
  const polls = _get(data, 'getPolls.polls', []);

  const add = () => {
    route.push({
      pathname: `/poll/add`,
      query: {
        sequence: polls.length + 1,
      },
    });
  };
  const edit = (record: IPollItem) => {
    route.push({
      pathname: `/poll/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IPollItem) => {
    await deletePoll({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
    },
    {
      title: 'Network',
      dataIndex: 'category',
    },
    {
      title: 'Options',
      dataIndex: 'options',
    },
    {
      title: 'Created date',
      dataIndex: 'created_at',
      render: (_: any, record: IPollItem) => (
        <span>{format(new Date(+record.created_at), 'dd MMM yyyy')}</span>
      ),
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IPollItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Poll"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Poll
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table
          pagination={{ position: ['topRight', 'bottomRight'] }}
          columns={columns}
          dataSource={polls}
        />
      </Spin>
    </Box>
  );
};
