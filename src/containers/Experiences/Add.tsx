import React, { useMemo, useState } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message, DatePicker, Checkbox } from 'antd';
import { IExpItem } from 'src/types';
import _get from 'lodash/get';
import { useMutation } from '@apollo/client';
import _omit from 'lodash/omit';
import { useRouter } from 'next/router';
import { CREATE_EXPERIENCE } from 'src/graphql/mutation/experiences.muation';

export const AddExperience = () => {
  const [disabled, setDisabled] = useState(false);
  const route = useRouter();
  const sequence = _get(route, 'query.sequence', 1);
  const [creatExperience, { loading, error }] = useMutation(CREATE_EXPERIENCE);
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
      current: values.current || false,
      startMonth: Number(values.start.format('MM')),
      startYear: Number(values.start.format('YYYY')),
      endMonth: 0,
      endYear: 0,
      sequence: Number(sequence),
    };
    if (values.end) {
      expericenVariables = {
        ...expericenVariables,
        endMonth: Number(values.end.format('MM')),
        endYear: Number(values.end.format('YYYY')),
      };
    }
    await creatExperience({
      variables: expericenVariables,
    });

    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);
  const onPresentChange = (e) => {
    form.resetFields(['end']);
    setDisabled(e);
  };
  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Experiences" subTitle="Add new" />
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
            <Checkbox defaultChecked={true}>Hide</Checkbox>
          </Form.Item>
          {/* submit */}
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
