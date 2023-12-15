import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import { format } from 'date-fns';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Button, Spin, message, Table } from 'antd';
import { IEduItem } from 'src/types';
import { EDUCATIONS } from 'src/graphql/query/educations.query';
import { PlusOutlined } from '@ant-design/icons';
import { DELETE_EDUCATION } from 'src/graphql/mutation/educations.muation';

export const Educations = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<IEduItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(EDUCATIONS);
  const [deleteEducation] = useMutation(DELETE_EDUCATION);
  const educations = _get(data, 'getEducations.educations', []);

  const add = () => {
    route.push({
      pathname: `/education/add`,
      query: {
        sequence: educations.length + 1,
      },
    });
  };
  const edit = (record: IEduItem) => {
    route.push({
      pathname: `/education/${record.id}/edit`,
      query: {
        ...record,
      },
    });
  };
  const remove = async (record: IEduItem) => {
    await deleteEducation({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(educations);
  }, [educations]);

  const columns = [
    {
      title: 'Degree',
      dataIndex: 'degree',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      render: (_: any, record: IEduItem) => {
        const start =
          record.startMonth && record.startYear
            ? format(new Date(record.startYear, record.startMonth, 0), 'MMM yyyy')
            : null;
        const end =
          record.endMonth && record.endYear
            ? format(new Date(record.endYear, record.endMonth, 0), 'MMM yyyy')
            : null;
        return `${start} - ${end}`;
      },
    },
    {
      title: 'School',
      dataIndex: 'school',
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      width: 150,
      render: (_: any, record: IEduItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Educations"
        extra={[
          <Button
            onClick={() => add()}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 10 }}
          >
            Add Education
          </Button>,
        ]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table columns={columns} dataSource={dataSource} />
      </Spin>
    </Box>
  );
};
