import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const Profile = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Handle profile update logic here
  };

  return (
    <div className="mt-8 mb-8 lg:mt-20 lg:mb-20 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">User Profile</h1>
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <Form
            form={form}
            name="profile"
            onFinish={onFinish}
            initialValues={{
              name: 'John Doe',
              email: 'johndoe@example.com',
              phone: '(555) 555-1234',
            }}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your E-mail!' }
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;