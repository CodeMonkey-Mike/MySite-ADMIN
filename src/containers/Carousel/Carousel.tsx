import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Spin, message, Table } from 'antd';
import { ICarouselItem } from 'src/types';
import { DELETE_CAROUSEL } from 'src/graphql/mutation/carousel.mutation';
import { CAROUSEL } from 'src/graphql/query/carousel.query';
import { format } from 'date-fns';

export const Carousel = () => {
  const route = useRouter();
  const { loading, error, data, refetch } = useQuery(CAROUSEL);
  const [deletePoll] = useMutation(DELETE_CAROUSEL);
  const polls = _get(data, 'getCarousels.carousel', []);

  const edit = (record: ICarouselItem) => {
    route.push({
      pathname: `/carousel/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };

  const remove = async (record: ICarouselItem) => {
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
      width: '70%',
    },
    {
      title: 'Created date',
      dataIndex: 'created_at',
      render: (_: any, record: ICarouselItem) => (
        <span>{format(new Date(+record.created_at), 'dd MMM yyyy')}</span>
      ),
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: ICarouselItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Carousel" />
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
