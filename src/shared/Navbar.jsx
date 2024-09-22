import { AlertOutlined, DollarOutlined, HomeOutlined, InboxOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Menu } from 'antd'
import { Header } from 'antd/es/layout/layout'
import React, { useState } from 'react'
import { MdAdminPanelSettings, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setUser } from '../redux/features/userSlice'
import { GrUserAdmin } from 'react-icons/gr'
import { Grid, Space, theme } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { useBreakpoint } = Grid;
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





    const { token } = useToken();
    const screens = useBreakpoint();

    const menuItems = [
        {
            label: "Home",
            key: "home",
        },
        {
            label: "Donation",
            key: "donation",
        },
        {
            label: "Crisis",
            key: "crisis",
        },
        {
            label: "Volunteer",
            key: "volunteer",
        },
        {
            label: "Inventory",
            key: "inventory",
        },
    ];

    const [current, setCurrent] = useState("projects");
    const onClick = (e) => {
        console.log("click ", e);
        setCurrent(e.key);
    };

    const styles = {
        container: {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 auto",
            maxWidth: token.screenXL,
            padding: screens.md ? `0px ${token.paddingLG}px` : `0px ${token.padding}px`
        },
        header: {
            backgroundColor: token.colorBgContainer,
            borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
            position: "relative"
        },
        logo: {
            display: "block",
            height: token.sizeLG,
            left: "50%",
            position: screens.md ? "static" : "absolute",
            top: "50%",
            transform: screens.md ? " " : "translate(-50%, -50%)"
        },
        menu: {
            backgroundColor: "transparent",
            borderBottom: "none",
            lineHeight: screens.sm ? "4rem" : "3.5rem",
            marginLeft: screens.md ? "0px" : `-${token.size}px`,
            width: screens.md ? "inherit" : token.sizeXXL
        },
        menuContainer: {
            alignItems: "center",
            display: "flex",
            gap: token.size,
            width: "100%"
        }
    };




    return (

        <div>
            <div>
                <Header className="flex items-center justify-between rounded-2xl bg-white hidden  lg:flex">
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
                        user.user ? (
                            <>
                                <Button icon={user.user.role === 'Admin' ? <GrUserAdmin className='text-red-500' size={20} /> : <UserOutlined />}>
                                    {user.user.username}
                                </Button>
                                <Button type="primary" onClick={handleLogout} className='ms-4'>Logout</Button>
                            </>
                        ) : (
                            <Button type="primary" icon={<UserOutlined />}>
                                <Link to="/login">Login</Link>
                            </Button>
                        )
                    }
                </Header>

    
            </div>
        </div>

    )
}

export default Navbar