import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import config from "../config"
import { useLocation, useNavigate } from 'react-router-dom'
import httpR from "../support/request";
import { message } from 'antd'

const Login: React.FC = (props: any): ReactElement => {
    const location = useLocation()
    const navigate = useNavigate()
    const [msg, setMsg] = useState<string>("redirecting...")
    useEffect(() => {
        const queryParam = new URLSearchParams(location.search);
        let token = queryParam.get("token");
        if (token === null) {
            window.location.href = `${config.api}/api/login`
            return
        }
        // process token
        setMsg('verifying token...')
        httpR.post("/api/login/handler", {
            token: token
        }).then((res) => {
            if (res.success === false) {
                message.error(res.message)
            } else {
                localStorage.setItem("token", res.data.token)
                navigate('/')
            }
        })
        // eslint-disable-next-line
    }, [location.search])
    return <p>{msg}</p>
}

export default Login;