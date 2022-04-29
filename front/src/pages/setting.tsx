import {
    Button,
    Form,
    Input,
} from 'antd';
import type { ReactElement } from 'react'

const Setting: React.FC = (props: any): ReactElement => {

    const submit = (value: any) => {
        let username: string = value.username
        console.log(username)
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
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Setting