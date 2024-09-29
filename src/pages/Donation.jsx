import React from 'react';
import { Form, Input, Button, Card, Statistic, Spin } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetDonationandExpensesQuery, useGetDonationQuery, usePostDonationMutation } from '../redux/api/baseApi';


const Donation = () => {
  const { data: donationDatas, isLoading } = useGetDonationQuery(undefined);
  const { data: donationandExpensesDatas, isLoading: isLoadingDonationandExpenses } = useGetDonationandExpensesQuery(undefined);
  const [postDonation, { isLoading: isPostingLoading }] = usePostDonationMutation(undefined);
  if(isLoading || isLoadingDonationandExpenses || isPostingLoading) return <Spin/>
  const onFinish = async (values) => {
    await postDonation(values);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 mb-20">
        <Card>
          <Statistic
            title="Total Donations"
            value={donationDatas[0]?.sum}
            precision={2}
            prefix="$"
          />
          <ResponsiveContainer width="100%" height={300} className="mt-4">
            <BarChart data={donationandExpensesDatas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_donations" fill="#8884d8" name="Donations" />
              <Bar dataKey="total_expenses" fill="#82ca9d" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Make a Donation" className=''>
          <Form
            name="donation"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your E-mail!' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Donation Amount"
              rules={[{ required: true, message: 'Please input the donation amount!' }]}
            >
              <Input prefix={<DollarOutlined />} type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Donate
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Donation;
