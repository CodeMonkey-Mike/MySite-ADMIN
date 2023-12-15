import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { PlusOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, DragableBodyRow, PageHeader } from 'src/components';
import { Button, Spin, message, Table } from 'antd';
import { IYoutubeItem } from 'src/types';
import { YOUTUBES } from 'src/graphql/query/youtubes.query';
import { DELETE_YOUTUBE, BULK_UPDATE_YOUTUBE } from 'src/graphql/mutation/youtubes.mutation';

export const Youtubes = () => {
  const route = useRouter();
  const { loading, error, data, refetch } = useQuery(YOUTUBES);
  const [dataSource, setDataSource] = useState<Array<IYoutubeItem> | []>([]);
  const [deleteYoutube] = useMutation(DELETE_YOUTUBE);
  const [bulkUpdate] = useMutation(BULK_UPDATE_YOUTUBE);
  const youtubes = _get(data, 'getYoutubes.youtubes', []);

  const add = () => {
    route.push({
      pathname: `/youtubes/add`,
      query: {
        sequence: youtubes.length + 1,
      },
    });
  };
  const edit = (record: IYoutubeItem) => {
    route.push({
      pathname: `/youtubes/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IYoutubeItem) => {
    await deleteYoutube({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(youtubes);
  }, [youtubes]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: 'URL',
      dataIndex: 'url',
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IYoutubeItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    async (dragIndex, hoverIndex) => {
      const dragRow = dataSource[dragIndex];
      const sortedData = update(dataSource, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });
      setDataSource(sortedData);
      // @ts-ignore
      const filterData = sortedData.map((item, idx) => ({
        id: item.id,
        code: item.code,
        url: item.url,
        title: item.title,
        sequence: idx + 1,
      }));
      await bulkUpdate({
        variables: {
          options: filterData,
        },
      });
      await refetch();
    },
    [dataSource, bulkUpdate, refetch]
  );

  const tableData = useMemo(() => (!!dataSource.length ? dataSource : youtubes), [
    youtubes,
    dataSource,
  ]);

  return (
    <Box>
      <PageHeader
        title="URLs"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add URL
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={tableData}
            components={components}
            // @ts-ignore
            onRow={(record, index) => ({
              index,
              moveRow,
            })}
          />
        </DndProvider>
      </Spin>
    </Box>
  );
};
