import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import _omit from 'lodash/omit';
import _get from 'lodash/get';
import { useQuery, useMutation } from '@apollo/client';
import { Box } from '@theme-ui/components';
import { ActionsButton, PageHeader } from 'src/components';
import { Spin, message, Table } from 'antd';
import { INewsletterItem } from 'src/types';
import { NEWSLETTER } from 'src/graphql/query/newsletter.query';
import { DELETE_NEWSLETTER } from 'src/graphql/mutation/newsletter.mutation';
import { P } from 'src/atoms';
import { ExportExcel } from './ExportExcel';

export const Newsletter = () => {
  const route = useRouter();
  const [dataSource, setDataSource] = useState<Array<INewsletterItem> | []>([]);
  const { loading, error, data, refetch } = useQuery(NEWSLETTER);
  const [deleteNewsletter] = useMutation(DELETE_NEWSLETTER);
  const newsletter = _get(data, 'getNewsletter.newsletter', []);

  // const add = () => {
  //   route.push({
  //     pathname: `/newsletter/add`,
  //   });
  // };
  const edit = (record: INewsletterItem) => {
    route.push({
      pathname: `/newsletter/${record.id}/edit`,
      query: {
        ..._omit(record, '__typename'),
      },
    });
  };
  const remove = async (record: INewsletterItem) => {
    await deleteNewsletter({ variables: { id: record.id } });
    await refetch();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setDataSource(newsletter);
  }, [newsletter]);

  const exportData = useMemo(
    () =>
      newsletter.map((nl) => ({
        ..._omit(nl, ['id', '__typename']),
        topics: JSON.parse(nl.topics).toString(),
      })),
    [newsletter]
  );

  const wscols = useMemo(
    () => [
      { wch: Math.max(...exportData.map((ext) => ext.email.length)) },
      { wch: Math.max(...exportData.map((ext) => ext.topics.length)) },
    ],
    [exportData]
  );

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Subscribed Topics',
      dataIndex: 'topics',
      render: (_: any, { topics }: INewsletterItem) => {
        const topicList = JSON.parse(topics);
        return topicList.map((tp: string) => (
          <P margin="5px 0" size="var(--font-xs)">
            {tp}
          </P>
        ));
      },
    },
    {
      title: 'Edit/Remove',
      dataIndex: 'edit-remove',
      render: (_: any, record: INewsletterItem) => (
        <ActionsButton onEdit={() => edit(record)} onRemove={() => remove(record)} />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Newsletter"
        extra={[<ExportExcel wscols={wscols} dataSource={exportData} fileName="Newsletter" />]}
      />
      <Spin spinning={loading} tip="Loading...">
        <Table pagination={false} columns={columns} dataSource={dataSource} />
      </Spin>
    </Box>
  );
};
