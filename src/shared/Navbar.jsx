import { AlertOutlined, DollarOutlined, HomeOutlined, InboxOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Menu } from 'antd'
import { Header } from 'antd/es/layout/layout'
import React from 'react'
import { MdAdminPanelSettings, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setUser } from '../redux/features/userSlice'
import { GrUserAdmin } from 'react-icons/gr'

const Navbar = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log('sss');
        dispatch(setUser(null));
        toast.success(`${user.user.username} has been logged out`);
        navigate('/login');
    }
    return (
        <Header className="flex items-center justify-between rounded-2xl bg-white">
            <div className="text-black text-xl font-bold">Disaster Management</div>
            <Menu theme="light" mode="horizontal" className="flex-1 justify-end">
                <Menu.Item key="/" icon={<HomeOutlined />}>
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="/donation" icon={<DollarOutlined />}>
                    <Link to="/donation">Donation</Link>
                </Menu.Item>
                <Menu.Item key="/crisis" icon={<AlertOutlined />}>
                    <Link to="/crisis">Crisis</Link>
                </Menu.Item>
                <Menu.Item key="/volunteer" icon={<TeamOutlined />}>
                    <Link to="/volunteer">Volunteers</Link>
                </Menu.Item>
                <Menu.Item key="/inventory" icon={<InboxOutlined />}>
                    <Link to="/inventory">Inventory</Link>
                </Menu.Item>
            </Menu>
            {
                user.user ? <>
                    <Button icon={user.user.role === 'Admin' ? <GrUserAdmin className='text-red-500' size={20} /> : <UserOutlined />}>
                        {user.user.username}</Button>
                    <Button type="primary" onClick={handleLogout} className='ms-4'>Logout</Button>
                </>
                    :
                    <Button type="primary" icon={<UserOutlined />}>
                        <Link to="/login">Login</Link>
                    </Button>
            }
        </Header>
    )
}

export default Navbar