import { useEffect, useMemo } from 'react';
import moment from 'moment';
import { Box } from '@theme-ui/components';
import { PageHeader } from 'src/components';
import { Form, Input, Button, Spin, message, DatePicker } from 'antd';
import { IEduItem } from 'src/types';
import { useMutation } from '@apollo/client';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import { useRouter } from 'next/router';
import { UPDATE_EDUCATION } from 'src/graphql/mutation/educations.muation';

const { RangePicker } = DatePicker;
export const EditEducation = () => {
  const route = useRouter();
  const record = _get(route, 'query');
  const id = _get(route, 'query.id');
  const [updateSkill, { loading, error }] = useMutation(UPDATE_EDUCATION);
  const [form] = Form.useForm();
  const tailLayout = {
    wrapperCol: {
      offset: 3,
      span: 14,
    },
  };
  const onFinish = async (values: IEduItem) => {
    await updateSkill({
      variables: {
        ..._omit({ ...values }, ['timePeriod']),
        id: Number(id),
        startMonth: Number(values.timePeriod[0].format('MM')),
        startYear: Number(values.timePeriod[0].format('YYYY')),
        endMonth: Number(values.timePeriod[1].format('MM')),
        endYear: Number(values.timePeriod[1].format('YYYY')),
      },
    });
    route.back();
  };
  const dateFormatList = 'YYYY-MM';
  useEffect(() => {
    record &&
      form.setFieldsValue({
        ...record,
        timePeriod: [
          moment(`${record.startYear}-${record.startMonth}`, dateFormatList),
          moment(`${record.endYear}-${record.endMonth}`, dateFormatList),
        ],
      });
  }, [form, record]);

  useMemo(() => error?.message && message.error(error?.message), [error]);

  return (
    <Box>
      <PageHeader onBack={() => route.back()} icon title="Educations" subTitle="Edit" />
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

          <Form.Item {...tailLayout}>
            <Button type="primary" size="large" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Box>
  );
};
