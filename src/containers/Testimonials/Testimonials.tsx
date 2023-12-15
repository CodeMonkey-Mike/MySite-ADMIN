import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { PlusOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import _truncate from 'lodash/truncate';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Button, Spin, message, Table } from 'antd';
import { ITestimonialItem } from 'src/types';
import { TESTIMONIALS } from 'src/graphql/query/testimonials.query';
import { DELETE_TESTIMONIAL } from 'src/graphql/mutation/testimonials.mutation';

export const Testimonials = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<ITestimonialItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(TESTIMONIALS);
  const [deleteProcess] = useMutation(DELETE_TESTIMONIAL);
  const testimonials = _get(data, 'getTestimonials.testimonials', []);

  const add = () => {
    route.push({
      pathname: `/testimonial/add`,
    });
  };
  const edit = (record: ITestimonialItem) => {
    route.push({
      pathname: `/testimonial/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: ITestimonialItem) => {
    await deleteProcess({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(testimonials);
  }, [testimonials]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'Quote',
      dataIndex: 'quote',
      render: (_: any, record: ITestimonialItem) => _truncate(record.quote, { length: 50 }),
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: ITestimonialItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Testimonials"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Process
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table pagination={false} columns={columns} dataSource={dataSource} />
      </Spin>
    </Box>
  );
};
