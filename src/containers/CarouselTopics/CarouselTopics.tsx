import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import _truncate from 'lodash/truncate';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Spin, message, Table, Button } from 'antd';
import { ICarouselTopicItem } from 'src/types';
import { CAROUSEL_TOPICS } from 'src/graphql/query/carousel_topics.query';
import { DELETE_CAROUSEL_TOPICS } from 'src/graphql/mutation/carousel_topics.mutation';
import { PlusOutlined } from '@ant-design/icons';

export const CarouselTopics = () => {
  const route = useRouter();
  const { loading, error, data, refetch } = useQuery(CAROUSEL_TOPICS);
  const [deletePoll] = useMutation(DELETE_CAROUSEL_TOPICS);
  const topics = _get(data, 'getCarouselTopics.carouselTopics', []);

  const add = () => {
    route.push({
      pathname: `/carousel-topic/add`,
    });
  };

  const edit = (record: ICarouselTopicItem) => {
    route.push({
      pathname: `/carousel-topic/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };

  const remove = async (record: ICarouselTopicItem) => {
    await deletePoll({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      width: '30%',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      width: '50%',
      render: (_: any, record: ICarouselTopicItem) =>
        _truncate(record.content, {
          length: 150,
        }),
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: ICarouselTopicItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Carousel Topics"
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
        <Table
          pagination={{ position: ['topRight', 'bottomRight'] }}
          columns={columns}
          dataSource={topics}
        />
      </Spin>
    </Box>
  );
};
