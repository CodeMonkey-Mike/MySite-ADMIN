import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _truncate from 'lodash/truncate';
import { format } from 'date-fns';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, DragableBodyRow, PageHeader } from 'src/components';
import { Button, Spin, message, Table } from 'antd';
import { IExpItem } from 'src/types';
import { EDUCATIONS } from 'src/graphql/query/experiences.query';
import { PlusOutlined } from '@ant-design/icons';
import {
  BULK_UPDATE_EXPERIENCE,
  DELETE_EXPERIENCE,
} from 'src/graphql/mutation/experiences.muation';
import { DndProvider } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const Experiences = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<IExpItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(EDUCATIONS);
  const [deleteExperience] = useMutation(DELETE_EXPERIENCE);
  const [bulkUpdate] = useMutation(BULK_UPDATE_EXPERIENCE);
  const experiences = _get(data, 'getExperiences.experiences', []);

  const add = () => {
    route.push({
      pathname: `/experience/add`,
      query: {
        sequence: experiences.length + 1,
      },
    });
  };
  const edit = (record: IExpItem) => {
    route.push({
      pathname: `/experience/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IExpItem) => {
    await deleteExperience({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(experiences);
  }, [experiences]);

  const columns = [
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      render: (_: any, record: IExpItem) => {
        const start =
          record.startMonth && record.startYear
            ? format(new Date(record.startYear, record.startMonth, 0), 'MMM yyyy')
            : null;
        let end =
          record.endMonth && record.endYear
            ? format(new Date(record.endYear, record.endMonth, 0), 'MMM yyyy')
            : null;
        if (record.current) {
          end = 'Present';
        }
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (_: any, record: IExpItem) => _truncate(record.description, { length: 100 }),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      render: (_: any, record: IExpItem) => record.website || record.website_url,
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      width: 150,
      render: (_: any, record: IExpItem) => (
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
        title="Experiences"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Experience
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
