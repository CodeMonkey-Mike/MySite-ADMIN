import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message, DatePicker } from 'antd';
import { IExpItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import { useRouter } from 'next/router';
import { UPDATE_EXPERIENCE } from 'src/graphql/mutation/experiences.muation';
import Checkbox from 'antd/lib/checkbox/Checkbox';

export const EditExperience = () => {
  const [disabled, setDisabled] = useState(false);
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updateSkill, { loading, error }] = useMutation(UPDATE_EXPERIENCE);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 3,
      span: 14,
    },
  };
  const onFinish = async (values: IExpItem) => {
    let expericenVariables = {
      ..._omit({ ...values }, ['start, end']),
      startMonth: Number(values.start.format('MM')),
      startYear: Number(values.start.format('YYYY')),
      endMonth: 0,
      endYear: 0,
      id: Number(id),
      sequence: Number(record.sequence),
    };
    if (values.end) {
      expericenVariables = {
        ...expericenVariables,
        endMonth: Number(values.end.format('MM')),
        endYear: Number(values.end.format('YYYY')),
      };
    }
    if (values.current) {
      expericenVariables = {
        ...expericenVariables,
        endMonth: 0,
        endYear: 0,
      };
    }
    await updateSkill({
      variables: expericenVariables,
    });

    route.back();
  };
  const dateFormatList = 'YYYY-MM';
  useEffect(() => {
    record &&
      form.setFieldsValue({
        ...record,
        current: record.current === 'true',
        hide: record.hide === 'true',
        start: moment(`${record.startYear}-${record.startMonth}`, dateFormatList),
        end: moment(`${record.endYear}-${record.endMonth}`, dateFormatList),
      });
    if (record.current === 'true') {
      form.resetFields(['end']);
      setDisabled(true);
    }
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);
  const onPresentChange = (e) => {
    form.resetFields(['end']);
    setDisabled(e);
  };

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Experiences" subTitle="Edit" />
      <Spin spinning={loading} tip="Loading...">
        <Form
          layout="horizontal"
          form={form}
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="company" required label="Company">
            <Input placeholder="" required type="text" />
          </Form.Item>
          <Form.Item name="title" required label="Title">
            <Input placeholder="" required />
          </Form.Item>
          <Form.Item name="description" required label="Description">
            <Input.TextArea placeholder="" required rows={5} />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="" type="text" />
          </Form.Item>
          <Form.Item name="website_url" label="Website URL">
            <Input placeholder="" type="text" />
          </Form.Item>
          <Form.Item name="start" required label="Start">
            <DatePicker picker="month" />
          </Form.Item>
          <Form.Item name="current" {...tailLayout} valuePropName="checked">
            <Checkbox onChange={(e) => onPresentChange(e.target.checked)}>
              I currently work here
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="end"
            required
            label="End"
            rules={[
              {
                validator: (_, value) =>
                  value || disabled
                    ? Promise.resolve()
                    : Promise.reject(new Error('Please select end date')),
              },
            ]}
          >
            <DatePicker picker="month" disabled={disabled} />
          </Form.Item>

          <Form.Item name="hide" {...tailLayout} valuePropName="checked">
            <Checkbox>Hide</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
