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
        <div className='w-full sticky top-0 z-50'>
            {/* Desktop Header */}
            <Header className="hidden lg:flex items-center justify-between bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 px-4 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-gray-800 text-xl font-bold hover:text-blue-600 transition-colors">
                        Disaster Management
                    </Link>
                </div>
                <Menu theme="light" mode="horizontal" className="flex-1 justify-end border-0">
                    <Menu.Item key="/" icon={<HomeOutlined />} className="hover:bg-blue-50 rounded-lg mx-1">
                        <Link to="/" className="font-medium">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/donation" icon={<DollarOutlined />} className="hover:bg-blue-50 rounded-lg mx-1">
                        <Link to="/donation" className="font-medium">Donation</Link>
                    </Menu.Item>
                    <Menu.Item key="/crisis" icon={<AlertOutlined />} className="hover:bg-blue-50 rounded-lg mx-1">
                        <Link to="/crisis" className="font-medium">Crisis</Link>
                    </Menu.Item>
                    <Menu.Item key="/volunteer" icon={<TeamOutlined />} className="hover:bg-blue-50 rounded-lg mx-1">
                        <Link to="/volunteer" className="font-medium">Volunteers</Link>
                    </Menu.Item>
                    <Menu.Item key="/inventory" icon={<InboxOutlined />} className="hover:bg-blue-50 rounded-lg mx-1">
                        <Link to="/inventory" className="font-medium">Inventory</Link>
                    </Menu.Item>
                </Menu>
                <div className="flex items-center gap-3">
                    {user?.user ? (
                        <>
                            <Button 
                                icon={user?.user?.role === 'Admin' ? <GrUserAdmin className='text-red-500' size={20} /> : <UserOutlined />}
                                className="flex items-center gap-2 font-medium"
                            >
                                {user.user.username}
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={handleLogout}
                                className="btn-primary-modern"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button type="primary" icon={<UserOutlined />} className="btn-primary-modern">
                            <Link to="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </Header>

            {/* Mobile Header */}
            <Header className="lg:hidden bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-gray-800 text-lg font-bold">Disaster Management</div>
                    </div>
                    <div className="flex items-center gap-2">
                        {user?.user ? (
                            <>
                                <Button 
                                    size="small"
                                    icon={user?.user?.role === 'Admin' ? <GrUserAdmin className='text-red-500' size={16} /> : <UserOutlined />}
                                    className="text-xs"
                                >
                                    {user.user.username}
                                </Button>
                                <Button 
                                    size="small" 
                                    type="primary" 
                                    onClick={handleLogout}
                                    className="btn-primary-modern text-xs px-3 py-1"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button size="large" type="primary" icon={<UserOutlined />} className="btn-primary-modern text-xs">
                                <Link to="/login">Login</Link>
                            </Button>
                        )}
                        <Button 
                            type="text" 
                            icon={<MenuOutlined />} 
                            onClick={showDrawer}
                            className="hover:bg-gray-100 rounded-lg"
                        />
                    </div>
                </div>
                <Drawer
                    title={
                        <div className="flex items-center gap-3">
                            <span className="font-semibold">Menu</span>
                        </div>
                    }
                    placement="right"
                    onClose={onClose}
                    open={visible}
                    bodyStyle={{ padding: 0 }}
                    width={300}
                    className="modern-drawer"
                >
                    <MenuComponent mode="vertical" onClose={onClose} />
                </Drawer>
            </Header>
        </div>
    );
}

