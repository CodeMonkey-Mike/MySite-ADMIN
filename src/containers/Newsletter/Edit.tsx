// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message, Checkbox } from 'antd';
import { INewsletterItem } from 'src/types';
import { useMutation, useQuery } from '@apollo/client';
import styled from 'styled-components';
import _get from 'lodash/get';
import { UPDATE_NEWSLETTER } from 'src/graphql/mutation/newsletter.mutation';
import { TOPICS } from 'src/graphql/query/topics.query';
import { useRouter } from 'next/router';

const CheckBoxItem = styled.label<{ ml?: string }>`
  display: flex;
  margin-top: 0.75rem;
  ${({ ml }) => ml && `margin-left: ${ml};`}
`;
export const EditNewsletter = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const topics = _get(route, 'query.topics');
  const { data: topicsData } = useQuery(TOPICS);
  const [updateNewsletter, { loading, error }] = useMutation(UPDATE_NEWSLETTER);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 5,
      span: 14,
    },
  };
  const [updateValues, setUpdateValues] = useState([]);

  const onFinish = async (values: INewsletterItem) => {
    await updateNewsletter({
      variables: {
        ...values,
        topics: `[${values.topics}]`,
        id: Number(id),
      },
    });
    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);
  const _topics = useMemo(() => {
    const data = _get(topicsData, 'getNewsletterTopics.newsletterTopics', []);
    return data.map((d) => ({
      ...d,
      checked: topics.includes(d.title),
    }));
  }, [topicsData, topics]);

  const defaultTopics = useMemo(() => {
    return _topics.filter((tpd) => topics.includes(tpd.title)).map((item) => item.id);
  }, [topics, _topics]);

  const onValueChange = useCallback(
    (e) => {
      const currentVal = e.target.value;
      const currentChecked = e.target.checked;
      if (currentChecked) {
        setUpdateValues((prv) => [...new Set([...prv, currentVal])]);
      } else {
        setUpdateValues((prv) => [...prv.filter((i) => i !== currentVal)]);
      }
    },
    [defaultTopics]
  );

  const onSelectAllChange = useCallback(
    (e) => {
      if (e.target.checked) {
        const vls = _topics.map((i) => i.id);
        setUpdateValues(vls);
        form.setFieldsValue({
          topics: _topics.map((i) => i.id),
        });
      } else {
        setUpdateValues([]);
        form.setFieldsValue({
          topics: [],
        });
      }
    },
    [_topics]
  );

  useEffect(() => {
    setUpdateValues(defaultTopics);
    record &&
      form.setFieldsValue({
        ...record,
        topics: defaultTopics,
      });
  }, [form, record, defaultTopics, setUpdateValues]);

  useEffect(() => {
    form.setFieldsValue({
      topics: updateValues,
    });
  }, [form, updateValues]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Newsletter" subTitle="Edit" />
      <Spin spinning={loading} tip="Loading...">
        <Form
          layout="horizontal"
          form={form}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="email" required label="Email">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="topics" required label="Topics">
            <CheckBoxItem ml="0.5rem">
              <Checkbox
                onChange={onSelectAllChange}
                checked={updateValues.length === _topics.length}
              >
                Select all
              </Checkbox>
            </CheckBoxItem>
            {_topics.map((topic) => (
              <CheckBoxItem ml="1rem" key={topic.id}>
                <Checkbox
                  name="topics[]"
                  defaultChecked={topic.checked}
                  checked={!!updateValues.includes(topic.id)}
                  value={topic.id}
                  onChange={onValueChange}
                >
                  {topic.title}
                </Checkbox>
              </CheckBoxItem>
            ))}
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
