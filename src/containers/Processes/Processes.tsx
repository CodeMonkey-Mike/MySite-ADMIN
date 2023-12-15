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
import { IProcessItem } from 'src/types';
import { PROCESSES } from 'src/graphql/query/processes.query';
import { DELETE_PROCESS, BULK_UPDATE_PROCESS } from 'src/graphql/mutation/processes.mutation';
import styled from 'styled-components';

const IconFont = styled.i`
  font-size: 30px;
`;

export const Processes = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<IProcessItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(PROCESSES);
  const [deleteProcess] = useMutation(DELETE_PROCESS);
  const [bulkUpdate] = useMutation(BULK_UPDATE_PROCESS);
  const processes = _get(data, 'getProcesses.processes', []);

  const add = () => {
    route.push({
      pathname: `/process/add`,
      query: {
        sequence: processes.length + 1,
      },
    });
  };
  const edit = (record: IProcessItem) => {
    route.push({
      pathname: `/process/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IProcessItem) => {
    await deleteProcess({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(processes);
  }, [processes]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      render: (_: any, record: IProcessItem) => {
        return <IconFont className={`fas ${record.icon}`} />;
      },
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IProcessItem) => (
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

  return (
    <Box>
      <PageHeader
        title="Processes"
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
        <DndProvider backend={HTML5Backend}>
          <Table
            pagination={{
              defaultPageSize: 20,
            }}
            columns={columns}
            dataSource={dataSource}
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
