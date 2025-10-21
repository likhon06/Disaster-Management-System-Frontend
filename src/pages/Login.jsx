import React from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import registerImage from '../assets/images/auth.png'
import { usePostLoginMutation } from '../redux/api/baseApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/userSlice';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [postLogin, { isLoading: loginLoading }] = usePostLoginMutation(undefined);
  if (loginLoading) return <Spin />;


  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    console.log(values);
    const res = await postLogin(values);
    console.log(res);
    const real_data = await jwtDecode(res?.data?.token);
    toast.success(`${real_data.username} logged in successfully`);
    dispatch(setUser(real_data));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4"
              >
                <Form.Item
                  name="username"
                  label={<span className="font-semibold text-gray-700">Username</span>}
                  rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-gray-400" />} 
                    placeholder="Raiden"
                    className="input-modern"
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  label={<span className="font-semibold text-gray-700">Password</span>}
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-gray-400" />} 
                    placeholder="admin123"
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
                    Sign In
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account? 
                  <Link to="/register" className='text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors duration-200'>
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl"></div>
            <img 
              className='w-full h-auto rounded-2xl relative z-10' 
              src={registerImage} 
              alt="Disaster Management Login" 
            />
            <div className="absolute inset-0 rounded-2xl z-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;