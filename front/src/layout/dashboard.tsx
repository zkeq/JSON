import React, { useEffect }  from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    HomeOutlined,
} from "@ant-design/icons";
import {
    Layout,
    Menu,
    message,
    MenuProps
} from 'antd';
import httpR from "../supporter/request";
import config from "../config";

const { Content, Footer, Sider } = Layout;

const DashboardLayout = () => {
   // const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem('token') === null){
            message.warn('please Login First');
           //  navigate('/login')
        }
        // check login status
        httpR.post("/api/login/is_login",{}).then((res) => {
            if (res.success !== true) {
                localStorage.removeItem("token")
                message.warn('login timeout');
              //  navigate('/login')
            }
        })
        // eslint-disable-next-line
    }, []);


    const items: MenuProps['items'] = [
         {
             label: '首页' ,
             key: '/',
             icon: <HomeOutlined />,
         },
         {
             label: 'json管理',
             key: '/json',
             icon: <DashboardLayout />,
         },
    ]

    const changeMenu = (e: any) => {
        // if (e.key !== '/logout') navigate(e.key)
    }
    let selected_key = []
    selected_key.push(location.pathname)
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