import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { PlusOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Button, Spin, message, Table, Image } from 'antd';
import { IAwardItem } from 'src/types';
import { AWARD } from 'src/graphql/query/awards.query';
import { DELETE_AWARD } from 'src/graphql/mutation/awards.mutation';
import { format } from 'date-fns';

export const Awards = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<IAwardItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(AWARD);
  const [deleteProcess] = useMutation(DELETE_AWARD);
  const awards = _get(data, 'getAwards.awards', []);

  const add = () => {
    route.push({
      pathname: `/award/add`,
      query: {
        sequence: awards.length + 1,
      },
    });
  };
  const edit = (record: IAwardItem) => {
    route.push({
      pathname: `/award/${record.id}/edit`,
      // @ts-ignore
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IAwardItem) => {
    await deleteProcess({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(awards);
  }, [awards]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'Award Time',
      dataIndex: 'awardTime',
      render: (_: any, record: IAwardItem) => format(new Date(record.awardTime), 'MMM yyyy'),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (_: any, record: IAwardItem) => {
        return <Image src={record.image} width={150} />;
      },
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IAwardItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Awards"
        extra={[
          <Button onClick={() => add()} type="primary" icon={<PlusOutlined />}>
            Add Award
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table columns={columns} dataSource={dataSource} />
      </Spin>
    </Box>
  );
};
