import React from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import registerImage from '../assets/images/auth.png'
import { usePostRegisterMutation } from '../redux/api/baseApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { setUser } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section */}
        <div className="flex items-center justify-center order-2 lg:order-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl"></div>
            <img 
              className='w-full h-[500px] object-cover rounded-2xl relative z-10' 
              src={registerImage} 
              alt="Disaster Management Register" 
            />
          </div>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center order-1 lg:order-2">
          <div className="w-full max-w-md">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as Volunteer</h1>
                <p className="text-gray-600">Create your account to start making a difference</p>
              </div>

              <Form
                name="register"
                onFinish={onFinish}
                scrollToFirstError
                layout="vertical"
                className="space-y-4"
              >
                {/* Username and Email in one line */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Form.Item
                    name="username"
                    label={<span className="font-semibold text-gray-700">Username</span>}
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    className="flex-1"
                  >
                    <Input 
                      prefix={<UserOutlined className="text-gray-400" />} 
                      placeholder="Choose a username"
                      className="input-modern"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label={<span className="font-semibold text-gray-700">Email Address</span>}
                    rules={[
                      { type: 'email', message: 'The input is not valid E-mail!' },
                      { required: true, message: 'Please input your E-mail!' }
                    ]}
                    className="flex-1"
                  >
                    <Input 
                      prefix={<MailOutlined className="text-gray-400" />} 
                      placeholder="Enter your email"
                      className="input-modern"
                      size="large"
                    />
                  </Form.Item>
                </div>

                {/* Password and Confirm Password in one line */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Form.Item
                    name="password"
                    label={<span className="font-semibold text-gray-700">Password</span>}
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    hasFeedback
                    className="flex-1"
                  >
                    <Input.Password 
                      prefix={<LockOutlined className="text-gray-400" />} 
                      placeholder="Create a password"
                      className="input-modern"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    label={<span className="font-semibold text-gray-700">Confirm Password</span>}
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
                    className="flex-1"
                  >
                    <Input.Password 
                      prefix={<LockOutlined className="text-gray-400" />} 
                      placeholder="Confirm your password"
                      className="input-modern"
                      size="large"
                    />
                  </Form.Item>
                </div>

                {/* Phone Number */}
                <Form.Item
                  name="phone"
                  label={<span className="font-semibold text-gray-700">Phone Number</span>}
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <Input 
                    prefix={<PhoneOutlined className="text-gray-400" />} 
                    placeholder="Enter your phone number"
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
                    <UserOutlined className="mr-2" />
                    Create Account
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account? 
                  <Link to="/login" className='text-green-600 hover:text-green-700 font-semibold ml-1 transition-colors duration-200'>
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;