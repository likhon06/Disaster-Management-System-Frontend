import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
    HomeOutlined,
    DollarOutlined,
    AlertOutlined,
    TeamOutlined,
    InboxOutlined,
    UserOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { GrUserAdmin } from 'react-icons/gr';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/features/userSlice';
import { toast } from 'sonner';

const { Header } = Layout;

export default function Navbar() {
    const [visible, setVisible] = useState(false);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(setUser(null));
        toast.success(`${user?.user?.username} has been logged out`);
        navigate('/login');
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: 'Home' },
        { key: '/donation', icon: <DollarOutlined />, label: 'Donation' },
        { key: '/crisis', icon: <AlertOutlined />, label: 'Crisis' },
        { key: '/volunteer', icon: <TeamOutlined />, label: 'Volunteers' },
        { key: '/inventory', icon: <InboxOutlined />, label: 'Inventory' },
    ];

    const MenuComponent = ({ mode = 'horizontal', onClose }) => (
        <Menu
            theme="light"
            mode={mode}
            selectedKeys={[location.pathname]}
            style={{ border: 'none' }}
        >
            {menuItems.map((item) => (
                <Menu.Item key={item.key} icon={item.icon} onClick={onClose}>
                    <Link to={item.key}>{item.label}</Link>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div className=''>
            <Header className="hidden lg:flex items-center justify-between rounded-2xl bg-white">
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
                    user?.user ? <>
                        <Button icon={user?.user?.role === 'Admin' ? <GrUserAdmin className='text-red-500' size={20} /> : <UserOutlined />}>
                            {user.user.username}</Button>
                        <Button type="primary" onClick={handleLogout} className='ms-4'>Logout</Button>
                    </>
                        :
                        <Button type="primary" icon={<UserOutlined />}>
                            <Link to="/login">Login</Link>
                        </Button>
                }
            </Header>
            <div className='md:hidden lg:hidden'>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h1 style={{ margin: 0, marginRight: '20px' }}>Disaster Management</h1>
                                <div className="desktop-menu" style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                                    <MenuComponent />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="mobile-menu" style={{ display: 'block', '@media (min-width: 768px)': { display: 'none' } }}>
                                    <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} />
                                </div>
                                {user ? (
                                    <>
                                        <Button icon={user.role === 'Admin' ? <GrUserAdmin style={{ color: 'red' }} /> : <UserOutlined />} style={{ marginRight: '10px' }}>
                                            {user.username}
                                        </Button>
                                        <Button type="primary" onClick={handleLogout}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button type="primary" icon={<UserOutlined />}>
                                        <Link to="/login">Login</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <Drawer
                        title="Menu"
                        placement="left"
                        onClose={onClose}
                        visible={visible}
                        bodyStyle={{ padding: 0 }}
                    >
                        <MenuComponent mode="vertical" onClose={onClose} />
                    </Drawer>
                </Header>
            </div>

        </div>
    );
}

