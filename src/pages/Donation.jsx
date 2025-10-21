import React from "react";
import { Form, Input, Button, Card, Statistic, Spin } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  useGetDonationandExpensesQuery,
  useGetDonationQuery,
  usePostDonationMutation,
} from "../redux/api/baseApi";

const Donation = () => {
  const { data: donationDatas, isLoading } = useGetDonationQuery(undefined);
  const {
    data: donationandExpensesDatas,
    isLoading: isLoadingDonationandExpenses,
  } = useGetDonationandExpensesQuery(undefined);
  const [postDonation, { isLoading: isPostingLoading }] =
    usePostDonationMutation(undefined);
  if (isLoading || isLoadingDonationandExpenses || isPostingLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading data, please wait..." size="large" vertical={true} />
      </div>
    );
  const onFinish = async (values) => {
    await postDonation(values);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mt-8 mb-8 lg:mt-20 lg:mb-20 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Support <span className="">Disaster Relief</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your contribution makes a real difference in helping communities
            recover from disasters
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Statistics Card */}
          <Card className="w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Total Donations
                  </h3>
                  <p className="text-sm text-gray-500">Raised so far</p>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-4xl sm:text-5xl font-bold mb-2">
                  ${donationDatas[0]?.sum}
                </div>
              </div>

              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationandExpensesDatas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total_donations"
                      stroke="#3b82f6"
                      name="Donations"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_expenses"
                      stroke="#22c55e"
                      name="Expenses"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Donation Form Card */}
          <Card className="w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Make a Donation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Every contribution matters
                  </p>
                </div>
              </div>

              <Form
                name="donation"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4"
              >
                <Form.Item
                  name="name"
                  label={
                    <span className="font-semibold text-gray-700">
                      Full Name
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input
                    placeholder="Enter your full name"
                    className="input-modern"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={
                    <span className="font-semibold text-gray-700">
                      Email Address
                    </span>
                  }
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    { required: true, message: "Please input your E-mail!" },
                  ]}
                >
                  <Input
                    placeholder="Enter your email address"
                    className="input-modern"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="amount"
                  label={
                    <span className="font-semibold text-gray-700">
                      Donation Amount
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input the donation amount!",
                    },
                  ]}
                >
                  <Input
                    prefix={<DollarOutlined className="text-gray-400" />}
                    type="number"
                    placeholder="Enter amount"
                    className="input-modern"
                    size="large"
                  />
                </Form.Item>

                <Form.Item className="mt-8">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full btn-primary-modern text-lg py-4"
                    size="large"
                  >
                    Make Donation
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Donation;
