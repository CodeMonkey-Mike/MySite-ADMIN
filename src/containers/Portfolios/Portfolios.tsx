import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { PlusOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, DragableBodyRow, PageHeader } from 'src/components';
import { Button, Spin, message, Table, Image } from 'antd';
import { IPortfolioItem } from 'src/types';
import { PORTFOLIO } from 'src/graphql/query/portfolios.query';
import { DELETE_PORTFOLIO, BULK_UPDATE_PORTFOLIO } from 'src/graphql/mutation/portfolios.mutation';

export const Portfolios = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<IPortfolioItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(PORTFOLIO);
  const [deletePortfolio] = useMutation(DELETE_PORTFOLIO);
  const [bulkUpdate] = useMutation(BULK_UPDATE_PORTFOLIO);
  const portfolios = _get(data, 'getPortfolios.portfolios', []);

  const add = () => {
    route.push({
      pathname: `/portfolio/add`,
      query: {
        sequence: portfolios.length + 1,
      },
    });
  };
  const edit = (record: IPortfolioItem) => {
    route.push({
      pathname: `/portfolio/${record.id}/edit`,
      // @ts-ignore
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IPortfolioItem) => {
    await deletePortfolio({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(portfolios);
  }, [portfolios]);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      render: (_: any, record: IPortfolioItem) => {
        // @ts-ignore
        return record.logo ? <Image width={200} src={record.logo} /> : null;
      },
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: IPortfolioItem) => (
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
        ..._omit(item, ['__typename']),
        id: item.id,
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
        title="Portfolios"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Portfolio
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <DndProvider backend={HTML5Backend}>
          <Table
            pagination={false}
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
