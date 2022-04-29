import { Button, Drawer, Form, Input, message, Modal, PaginationProps, Popconfirm, Space, Table, Typography } from 'antd';
import { ReactElement, useEffect, useState } from 'react'
import httpR from '../support/request';
import config from '../config';
import ReactJson from 'react-json-view';

const Control: React.FC = (props: any): ReactElement => {

    const [addModalVisiable, setAddModalVisiable] = useState<boolean>(false)
    const [addForm] = Form.useForm();
    const [addJsonLoad, setAddJsonLoad] = useState<boolean>(false)
    const [data, setData] = useState<any>([])
    const [pagination, setPagination] = useState<PaginationProps>({ current: 1, pageSize: 12, total: 0, pageSizeOptions: [5, 10, 12, 15, 20, 30] })
    const [dataLoading, setDataLoading] = useState<boolean>(true)
    const [fresh, setFresh] = useState<number>(0)
    const [username, setUsername] = useState<string>('')

    // drawer 
    const [drawerVisiable, setDrawerVisiable] = useState(false);
    const [jsonForm] = Form.useForm();
    const [jsonFormB] = Form.useForm();
    const [json, setJson] = useState<any>({})

    type editDataType = {
        id: number,
        route_name: string,
        json: string
    }
    const [editData, setEditData] = useState<editDataType>({
        id: -1,
        route_name: '',
        json: '{}',
    })

    useEffect(() => {
        setDataLoading(true)
        httpR.post('/api/json/get', {
            limit: pagination.pageSize,
            page: pagination.current
        }).then((res) => {
            if (res.success === true) {
                setData(res.data.routes)
                setPagination(pagination => ({ ...pagination, total: res.data.count }))
                setUsername(res.data.username)
            } else {
                message.error(res.message)
            }
        }).finally(() => {
            setDataLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.current, pagination.pageSize, fresh])

    useEffect(() => {
        if (editData.id === -1) return
        httpR.post(`/json/${username}/${editData.route_name}`, {}).then((res) => {
            setEditData(editData => ({ ...editData, json: res }))
            jsonForm.setFieldsValue({
                json: JSON.stringify(res)
            })
            try {
                setJson(res || {})
            } catch (e) {
                setJson({
                    error: 'invialid json'
                })
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData.id])

    const add = async () => {
        setAddJsonLoad(true)
        let route_name = addForm.getFieldValue('route_name')
        httpR.post('/api/json/add', {
            route_name
        }).then((res) => {
            if (res.success === false) {
                message.error(res.message)
            } else {
                message.success('add success')
                setAddModalVisiable(false)
                setFresh(fresh + 1)
            }
        }).finally(() => {
            addForm.resetFields()
            setAddJsonLoad(false)
        })
    }

    const del = () => {
        httpR.post('/api/json/delete', {
            route_name: editData.route_name
        }).then((res) => {
            if (res.success === false) {
                message.error(res.message)
            } else {
                message.success('del success')
                setEditData(editData => ({ ...editData, id: -1 }))
                setFresh(fresh + 1)
                setDrawerVisiable(false)
            }
        })
    }

    const update = () => {
        httpR.post('/api/json/update_json', {
            route_name: editData.route_name,
            data_content: editData.json
        }).then((res) => {
            if (res.success === false) {
                message.error(res.message)
            } else {
                message.success('update success')
                setEditData(editData => ({ ...editData, id: -1 }))
                setFresh(fresh + 1)
                handleDrawerClose()
            }
        })
    }

    const update_route = (res: any) => {
        httpR.post('/api/json/update_route', {
            route_name: editData.route_name,
            new_route_name: res.new_route_name
        }).then((res) => {
            if (res.success === false) {
                message.error(res.message)
            } else {
                message.success('update success')
                setFresh(fresh + 1)
                handleDrawerClose()
                setEditData(editData => ({ ...editData, id: -1 }))
            }
        })
    }

    const handleDrawerClose = () => {
        setDrawerVisiable(false);
        jsonFormB.resetFields()
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: '10%',
        },
        {
            title: 'Route',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: 'link',
            render: (res: any) => {
                return <>
                    <Typography.Link onClick={() => {
                        window.open(`${config.api}/json/${username}/${res.name}`)
                    }} >
                        {`/json/${username}/${res.name}`}
                    </Typography.Link >
                </>
            },
        },
        {
            title: 'Action',
            render: (res: any) => {
                return <>
                    <Typography.Link onClick={() => {
                        setEditData({
                            id: res.id,
                            route_name: res.name,
                            json: "{}"
                        })
                        setDrawerVisiable(true)
                    }} >
                        Edit
                    </Typography.Link >
                </>
            },
        },
    ];


    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setPagination(pagination);
    }

    return (
        <div>
            <Button
                type="primary"
                onClick={() => setAddModalVisiable(true)}
            >
                Add
            </Button>
            <div style={{ height: "10px" }} />
            <Table
                loading={dataLoading}
                dataSource={data}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
                pagination={pagination}
                scroll={{ x: true }}
                bordered
            />
            { /* 侧边栏 json */}
            <Drawer
                forceRender
                title={editData.route_name}
                placement="right"
                width="90%"
                onClose={handleDrawerClose}
                visible={drawerVisiable}
                extra={
                    <Space>
                        <Button onClick={handleDrawerClose}>Cancel</Button>
                        <Button type="primary" onClick={() => update()}>
                            Save
                        </Button>
                        <Popconfirm
                            title="Are you sure to delete this json"
                            onConfirm={del}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                }
            >
                <Form
                    form={jsonForm}
                >
                    <Form.Item
                        name="json"
                    >
                        <Input.TextArea
                            onChange={(e) => {
                                setEditData({
                                    ...editData,
                                    json: e.target.value
                                })
                                try {
                                    setJson(JSON.parse(e.target.value))
                                } catch (e) {
                                    setJson({
                                        error: 'invialid json'
                                    })
                                }
                            }}
                            rows={10}
                        />
                    </Form.Item>
                </Form>
                <ReactJson
                    src={json}
                />
                <div style={{ height: "30px" }} />
                <Typography>
                    Rename route
                </Typography>
                <Form
                    form={jsonFormB}
                    onFinish={update_route}
                >
                    <Form.Item
                        label="new route_name"
                        name="new_route_name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            update route name
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
            { /* 添加的 modal */}
            <Modal
                title="Add"
                visible={addModalVisiable}
                onCancel={() => setAddModalVisiable(false)}
                forceRender={true}
                onOk={add}
                confirmLoading={addJsonLoad}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    initialValues={{ remember: true }}
                    onFinish={add}
                    layout="vertical"
                    form={addForm}
                >
                    <Form.Item
                        label="route_name"
                        name="route_name"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
}

export default Control