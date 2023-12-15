import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { PageHeader, DragableBodyRow, ActionsButton } from 'src/components';
import { Button, Spin, message, Table } from 'antd';
import { ISkillItem } from 'src/types';
import { MY_SKILLS } from 'src/graphql/query/skills.query';
import { DELETE_SKILL, BULK_UPDATE_SKILL } from 'src/graphql/mutation/skills.mutation';
import { PlusOutlined } from '@ant-design/icons';

export const MySkills = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<ISkillItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(MY_SKILLS);
  const [deleteSkill] = useMutation(DELETE_SKILL);
  const [bulkUpdate] = useMutation(BULK_UPDATE_SKILL);
  const skills = _get(data, 'getSkills.skills', []);

  const add = () => {
    route.push({
      pathname: `/skill/add`,
      query: {
        sequence: skills.length + 1,
      },
    });
  };
  const edit = (record: ISkillItem) => {
    route.push({
      pathname: `/skill/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: ISkillItem) => {
    await deleteSkill({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(skills);
  }, [skills]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Strength',
      dataIndex: 'strength',
      render: (_: any, record: ISkillItem) => (record ? `${record.strength}%` : 0),
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: ISkillItem) => (
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
        strength: item.strength,
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
    [bulkUpdate, dataSource, refetch]
  );

  return (
    <Box>
      <PageHeader
        title="My Skills"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Skill
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
