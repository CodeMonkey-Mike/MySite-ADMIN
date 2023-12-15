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
import { IChannelItem } from 'src/types';
import { CHANNELS } from 'src/graphql/query/channels.query';
import { DELETE_CHANNEL, BULK_UPDATE_CHANNEL } from 'src/graphql/mutation/channels.mutation';
import styled from 'styled-components';

const IconFont = styled.i`
  font-size: 30px;
`;

export const Channels = () => {
  const route = useRouter();
  const { loading, error, data, refetch } = useQuery(CHANNELS);
  const [dataSource, setDataSource] = useState<Array<IChannelItem> | []>([]);
  const [deleteChannel] = useMutation(DELETE_CHANNEL);
  const [bulkUpdate] = useMutation(BULK_UPDATE_CHANNEL);
  const channels = _get(data, 'getChannels.channels', []);

  const add = () => {
    route.push({
      pathname: `/channel/add`,
      query: {
        sequence: channels.length + 1,
      },
    });
  };
  const edit = (record: IChannelItem) => {
    route.push({
      pathname: `/channel/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IChannelItem) => {
    await deleteChannel({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // useEffect(() => {
  //   setDataSource(channels);
  // }, [channels]);

  const columns = [
    {
      title: 'URL',
      dataIndex: 'url',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      render: (_: any, record: IChannelItem) => {
        return <IconFont className={`fab ${record.icon}`} />;
      },
    },
    {
      title: 'Visible',
      dataIndex: 'visible',
      render: (_: any, record: IChannelItem) => (record.visible ? 'Yes' : 'No'),
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IChannelItem) => (
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
        icon: item.icon,
        name: item.name,
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

  const tableData = useMemo(() => (!!dataSource.length ? dataSource : channels), [
    channels,
    dataSource,
  ]);

  return (
    <Box>
      <PageHeader
        title="Channels"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Channel
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
