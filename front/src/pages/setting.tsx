import {
    Button,
    Form,
    Input,
    message,
} from 'antd';
import { ReactElement, useState, useEffect } from 'react'
import httpR from '../support/request'

const Setting: React.FC = (props: any): ReactElement => {
    const [load, setLoad] = useState<boolean>(true)
    const [form] = Form.useForm();

    useEffect(() => {
        httpR.post("/api/user/get_username", {}).then((res: any) => {
            if (res.success === true) {
                form.setFieldsValue({
                    username: res.data.username
                })
            } else {
                message.error(res.message)
            }
        }).finally(() => {
            setLoad(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const submit = (value: any) => {
        setLoad(true)
        let username: string = value.username
        httpR.post("/api/user/set_username", {
            "username": username
        }).then((res) => {
            if (res.success === true) {
                message.success("username changed")
            } else {
                message.error(res.message)
            }
        }).catch((err) => {
            message.error(err.message)
        }).finally(() => {
            setLoad(false)
        })
    }

    return (
        <div
            style={{
                maxWidth: "90%",
                paddingLeft: "10%",
            }}
        >
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={submit}
                layout="vertical"
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        disabled={load}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={load}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Setting