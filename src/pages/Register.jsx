import React from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import registerImage from '../assets/images/auth.png'
import { usePostRegisterMutation } from '../redux/api/baseApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { setUser } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const dispatch = useDispatch();
  const naviate = useNavigate();
  const [postRegister, { isLoading: registerLoading }] = usePostRegisterMutation(undefined);
  if (registerLoading) return <Spin />;
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const res = await postRegister(values);
    console.log(res);
    if (res && res.data) {
      toast.success(res.data.message);
      navigate('/login');
    }
  };
  return (
    <div className='flex justify-center items-center flex-col-reverse lg:flex-row mt-20 mb-20'>
      <Card title="Register as a Volunteer" className="w-96">
        <Form
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'The input is not valid E-mail!' },
              { required: true, message: 'Please input your E-mail!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div>
        <img className='' src={registerImage} alt="" />
      </div>
    </div>
  );
};

export default Register;