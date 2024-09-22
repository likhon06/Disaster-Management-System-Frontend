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
    const res = await postLogin(values);
    const real_data = await jwtDecode(res.data.token);
    toast.success(`${real_data.username} logged in successfully`);
    dispatch(setUser(real_data));
    navigate('/');
  };

  return (
    <div className='flex justify-center items-center mt-20 mb-20 flex-col-reverse lg:flex-row'>
      <Card title="Login" className="w-96">
        <Form
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Log in
            </Button>
          </Form.Item>
          <p>dont have an account? <Link to="/register" className='text-blue-500'>Register</Link></p>
        </Form>
      </Card>
      <div>
        <img className='' src={registerImage} alt="" />
      </div>
    </div>
  );
};

export default Login;