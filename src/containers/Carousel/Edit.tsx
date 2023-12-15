import { useEffect, useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Spin, Table, message } from 'antd';
import { ICarouselSlideItem } from 'src/types';
import { useMutation, useQuery } from '@apollo/client';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { CAROUSEL_SLIDES } from 'src/graphql/query/carousel_slides.query';
import { format } from 'date-fns';
import { DELETE_CAROUSEL_SLIDE } from 'src/graphql/mutation/carousel_slides.mutation';

export const EditCarousel = () => {
  const route = useRouter();
  const carousel_id = Number(_get(route, 'query.id'));
  const { data, loading, error, refetch } = useQuery(CAROUSEL_SLIDES, {
    variables: {
      carousel_id,
    },
  });
  const [deleteCarouselSLide] = useMutation(DELETE_CAROUSEL_SLIDE);
  const carouselSlides = _get(data, 'getCarouselSlides.carouselSlides', []);

  const edit = (record: ICarouselSlideItem) => {
    route.push({
      pathname: `/carousel-slide/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };

  const remove = async (record: ICarouselSlideItem) => {
    await deleteCarouselSLide({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const columns = [
    {
      title: 'Sequence',
      dataIndex: 'sequence',
      width: '10%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '50%',
    },
    {
      title: 'Created date',
      dataIndex: 'created_at',
      render: (_: any, record: ICarouselSlideItem) => (
        <span>{format(new Date(+record.created_at), 'dd MMM yyyy')}</span>
      ),
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: ICarouselSlideItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Carousel Slides" />
      <Spin spinning={loading} tip="Loading...">
        <Table
          pagination={{ position: ['topRight', 'bottomRight'] }}
          columns={columns}
          dataSource={carouselSlides}
        />
      </Spin>
    </Box>
  );
};
