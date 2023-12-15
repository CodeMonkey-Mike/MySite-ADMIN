import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { PlusOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Button, Spin, message, Table, Image } from 'antd';
import { IServiceItem } from 'src/types';
import { SERVICES } from 'src/graphql/query/services.query';
import { DELETE_SERVICE } from 'src/graphql/mutation/services.mutation';

export const Services = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<IServiceItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(SERVICES);
  const [deleteProcess] = useMutation(DELETE_SERVICE);
  const services = _get(data, 'getServices.services', []);

  const add = () => {
    route.push({
      pathname: `/service/add`,
      query: {
        sequence: services.length + 1,
      },
    });
  };
  const edit = (record: IServiceItem) => {
    route.push({
      pathname: `/service/${record.id}/edit`,
      // @ts-ignore
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IServiceItem) => {
    await deleteProcess({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(services);
  }, [services]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (_: any, record: IServiceItem) => {
        return <Image src={record.image} width={150} />;
      },
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IServiceItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Services"
        extra={[
          <Button onClick={() => add()} type="primary" icon={<PlusOutlined />}>
            Add Service
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table columns={columns} dataSource={dataSource} rowClassName="row-bgcolor" />
      </Spin>
    </Box>
  );
};
