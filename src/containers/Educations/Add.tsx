import { useMemo } from 'react';
import { Box } from '@theme-ui/components';
import { PageHeader, SubmitButton } from 'src/components';
import { Form, Input, Spin, message, DatePicker } from 'antd';
import { IEduItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _omit from 'lodash/omit';
import { CREATE_EDUCATION } from 'src/graphql/mutation/educations.muation';
import { useRouter } from 'next/router';

const { RangePicker } = DatePicker;
export const AddEducation = () => {
  const route = useRouter();
  const [creatEducation, { loading, error }] = useMutation(CREATE_EDUCATION);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 3,
      span: 14,
    },
  };
  const onFinish = async (values: IEduItem) => {
    await creatEducation({
      variables: {
        ..._omit({ ...values }, ['timePeriod']),
        startMonth: Number(values.timePeriod[0].format('MM')),
        startYear: Number(values.timePeriod[0].format('YYYY')),
        endMonth: Number(values.timePeriod[1].format('MM')),
        endYear: Number(values.timePeriod[1].format('YYYY')),
      },
    });
    route.back();
  };

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Educations" subTitle="Add new" />
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
          <Form.Item name="degree" required label="Degree">
            <Input placeholder="" required />
          </Form.Item>

          <Form.Item name="description" required label="Description">
            <Input.TextArea placeholder="" required rows={5} />
          </Form.Item>
          <Form.Item name="location" required label="Location">
            <Input placeholder="" required type="text" />
          </Form.Item>
          <Form.Item name="school" required label="School">
            <Input placeholder="" required type="text" />
          </Form.Item>

          <Form.Item name="timePeriod" required label="Time Period">
            <RangePicker picker="month" />
          </Form.Item>

          {/* <Form.Item name="startMonth" required label="Start Month">
            <InputNumber placeholder="" required type="number" />
          </Form.Item>
          <Form.Item name="startYear" required label="Start Year">
            <InputNumber placeholder="" required type="number" />
          </Form.Item>
          
          <Form.Item name="endMonth" required label="End Month">
            <InputNumber placeholder="" required type="number" />
          </Form.Item>
          <Form.Item name="endYear" required label="End Year">
            <InputNumber placeholder="" required type="number" />
          </Form.Item> */}

          {/* submit */}
          <Form.Item {...tailLayout}>
            <SubmitButton type="primary" size="large" htmlType="submit" label="Submit" />
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
