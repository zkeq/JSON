import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import HomeOutlined from "@ant-design/icons/HomeOutlined";
import DashboardOutlined from "@ant-design/icons/DashboardOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import {
    Layout,
    Menu,
    message,
    MenuProps
} from 'antd';
import httpR from '../support/request';
import config from "../config";

const { Content, Footer, Sider } = Layout;

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            message.warn('please Login First');
            navigate('/login')
            return
        }
        // check login status
        httpR.post("/api/login/is_login", {}).then((res: any) => {
            if (res.success !== true) {
                localStorage.removeItem("token")
                message.warn('login timeout');
                navigate('/login')
            }
        })
        // eslint-disable-next-line
    }, []);

    type MenuItem = Required<MenuProps>['items'][number];

    const getItem = (
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
        type?: 'group',
    ): MenuItem => {
        return {
            key,
            icon,
            children,
            label,
            type,
        } as MenuItem;
    }


    const items: MenuProps['items'] = [
        getItem('首页', '/', <HomeOutlined />),
        getItem('json 管理', '/control', <DashboardOutlined />),
        getItem('用户设置', '/setting', <SettingOutlined />),
    ]

    const changeMenu = (e: any) => {
        if (e.key !== '/logout') navigate(e.key)
    }

    let selected_key: string[] = []
    useEffect(() => {
        selected_key.push(location.pathname)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])
    return (<>
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
            >
                <div style={{
                    height: "32px",
                    margin: "20px",
                    textAlign: "center",
                    color: "aliceblue",
                }} >
                    {config.title}
                </div>
                <Menu
                    selectedKeys={selected_key}
                    theme="dark"
                    mode="inline"
                    onClick={(e) => changeMenu(e)}
                    items={items}
                />

            </Sider>
            <Layout>
                <Content style={{ margin: "24px 16px 0" }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    copyright&copy; 2022
                </Footer>
            </Layout>
        </Layout>
    </>);
}

export default DashboardLayout;