import {
    Button,
    Form,
    Input,
    FormItemProps,
} from 'antd';
import type { ReactElement } from 'react'

const Setting: React.FC = (props: any): ReactElement => {

    const submit = (value: FormItemProps) => {
        console.log(value);
    }

    return (
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={submit}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Setting