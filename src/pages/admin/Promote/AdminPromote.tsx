import React, { useEffect, useState } from 'react';
import { MainApiRequest } from '@/services/MainApiRequest';
import { Button, Form, Input, DatePicker, Modal, Table, Select, Popconfirm, message, Space, Tag } from 'antd';
import moment from 'moment';
import "./AdminPromote.scss";
import axios from 'axios';
import { render } from '@testing-library/react';

const AdminPromote = () => {
    const [form] = Form.useForm();
    const [promoteList, setPromoteList] = useState<any[]>([]);
    const [couponList, setCouponList] = useState<any[]>([]);
    const [openCreatePromoteModal, setOpenCreatePromoteModal] = useState(false);
    const [openCreateCouponModal, setOpenCreateCouponModal] = useState(false);
    const [editPromote, setEditPromote] = useState<any>(null);
    const [editCoupon, setEditCoupon] = useState<any>(null);

    // Hàm random mã CouponCode
    const generateRandomCode = () => {
        const length = 15; // Random 15 ký tự
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const fetchPromoteList = async () => {
        const res = await MainApiRequest.get('/promote/list');
        setPromoteList(res.data);
    }

    const fetchCouponList = async () => {
        const res = await MainApiRequest.get('/promote/coupon/list');
        setCouponList(res.data);
    }

    useEffect(() => {
        fetchPromoteList();
        fetchCouponList();
    }, []);


    const onOpenCreatePromoteModal = (record: any = null) => {
        setEditPromote(record);
        if (record) {
            form.setFieldsValue({
                ...record,
                startAt: moment(record.startAt),
                endAt: moment(record.endAt),
            });
        }
        setOpenCreatePromoteModal(true);
    };

    const onOpenCreateCouponModal = (record: any = null) => {
        setEditCoupon(record);
        if (record) {
            form.setFieldsValue(record);
            form.setFieldsValue({ promoteId: record.promote.id });
        }
        setOpenCreateCouponModal(true);
    }

    const onOKCreatePromote = async () => {
        const data = form.getFieldsValue();

        if (data.startAt) {
            data.startAt = data.startAt.toISOString();
        } else {
            message.error("Start date is required!");
            return;
        }

        if (data.endAt) {
            data.endAt = data.endAt.toISOString();
        } else {
            message.error("End date is required!");
            return;
        }

        try {
            let res;
            if (editPromote) {
                res = await MainApiRequest.put(`/promote/${editPromote.id}`, data);
            } else {
                res = await MainApiRequest.post('/promote', data);
            }

            if (res && res.status === 200) {
                fetchPromoteList();
                setOpenCreatePromoteModal(false);
                form.resetFields();
                message.success("Promote saved successfully!");
            } else {
                message.error("Failed to save promote: " + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // Handle error from API request
            if ((error as any).response) {
                const err = error as any;
                message.error(`Error: ${err.response.data?.message || err.response.statusText}`);
            } else {
                message.error('An unexpected error occurred');
            }
        }
    };


    const onDeletePromote = async (id: number) => {
        try {
            const res = await MainApiRequest.delete(`/promote/${id}`);
            if (res && res.status === 200) {
                fetchPromoteList();
                fetchCouponList();
                message.success('Promote deleted successfully!');
            } else {
                message.error('Failed to delete promote: ' + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // Handle error from API request
            // if (axios.isAxiosError(error) && error.response) {
            //     const err = error as any;
            //     message.error(`Error: ${err.response.data?.message || err.response.statusText}`);
            // } else {
            //     message.error('An unexpected error occurred');
            // }
        }
    };
    const onOKCreateCoupon = async () => {
        const data = form.getFieldsValue();

        if (!data.code || data.code.trim() === "") {
            message.error("Coupon code is required!");
            return;
        }

        try {
            let res;
            if (editCoupon) {
                res = await MainApiRequest.put(`/promote/coupon/${editCoupon.id}`, data);
            } else {
                res = await MainApiRequest.post('/promote/coupon', data);
            }

            if (res && res.status === 200) {
                fetchCouponList();
                setOpenCreateCouponModal(false);
                form.resetFields();
                message.success("Coupon saved successfully!");
            } else {
                message.error("Failed to save coupon: " + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // // Handle error from API request
            // if (axios.isAxiosError(error) && error.response) {
            //     message.error(`Error: ${error.response.data?.message || error.response.statusText}`);
            // } else {
            //     message.error('An unexpected error occurred');
            // }
        }
    };



    const onDeleteCoupon = async (id: number) => {
        try {
            const res = await MainApiRequest.delete(`/promote/coupon/${id}`);
            if (res && res.status === 200) {
                fetchCouponList();
                message.success('Coupon deleted successfully!');
            } else {
                message.error('Failed to delete coupon: ' + res?.data?.message || "Unknown error");
            }
        } catch (error) {
            // // Handle error from API request
            // if (axios.isAxiosError(error) && error.response) {
            //     message.error(`Error: ${error.response.data?.message || error.response.statusText}`);
            // } else {
            //     message.error('An unexpected error occurred');
            // }
        }
    };


    const onCancelCreatePromote = () => {
        setOpenCreatePromoteModal(false);
        form.resetFields();
    }

    const onCancelCreateCoupon = () => {
        setOpenCreateCouponModal(false);
        form.resetFields();
    }
    console.log(couponList);

    return (
        <div className="container-fluid m-2">
            <h3 className='h3'>Promote & Coupon Management</h3>
            <Button
                type='primary'
                onClick={() => onOpenCreatePromoteModal()}
            >
                Create Promote
            </Button>
            <Button
                type='primary'
                onClick={() => onOpenCreateCouponModal()}
                style={{ marginLeft: 10 }}
            >
                Create Coupon
            </Button>

            <Modal
                className='promote-modal'
                title={editPromote ? "Edit Promote" : "Create Promote"}
                open={openCreatePromoteModal}
                onOk={() => onOKCreatePromote()}
                onCancel={() => onCancelCreatePromote()}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <div className='field-row'>
                        <Form.Item
                            label='Promote Name'
                            name='name'
                            rules={[{ required: true, message: 'Please input promote name!' }]}>
                            <Input type='text' />
                        </Form.Item>
                        <Form.Item
                            label='Type'
                            name='type'
                            rules={[{ required: true, message: 'Please select type!' }]}>
                            <Select>
                                <Select.Option value="PERCENT">Percentage</Select.Option>
                                <Select.Option value="FIXED">Fixed</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className='field-row'>
                        <Form.Item
                            label='Description'
                            name='description'
                            rules={[{ required: true, message: 'Please input description!' }]}>
                            <Input type='text' />
                        </Form.Item>
                        <Form.Item
                            label='Discount'
                            name='discount'
                            rules={[{ required: true, message: 'Please input discount!' }]}>
                            <Input type='number' />
                        </Form.Item>
                    </div>
                    <div className='field-row '>
                        <Form.Item
                            label='Start Date'
                            name='startAt'
                            rules={[{ required: true, message: 'Please select start date!' }]}>
                            <DatePicker showTime />
                        </Form.Item>
                        <Form.Item
                            label='End Date'
                            name='endAt'
                            rules={[{ required: true, message: 'Please select end date!' }]}>
                            <DatePicker showTime />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Modal
                className='promote-modal'
                title={editCoupon ? "Edit Coupon" : "Create Coupon"}
                open={openCreateCouponModal}
                onOk={() => onOKCreateCoupon()}
                onCancel={() => onCancelCreateCoupon()}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label='Promote Name'
                        name='promoteId'
                        rules={[{ required: true, message: 'Please input promote name!' }]}
                    >
                        <Select>
                            {promoteList.map((promote) => (
                                <Select.Option key={promote.id} value={promote.id}>
                                    {promote.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className='field-row'>
                        <Form.Item
                            label='Coupon Code'
                            name='code'
                            rules={[{ required: true, message: 'Please input coupon code!' }]}
                        >
                            <Input
                                addonAfter={
                                    <Button
                                        type="link"
                                        className='random-button'
                                        onClick={() => {
                                            const randomCode = generateRandomCode();
                                            form.setFieldsValue({ code: randomCode });
                                        }}
                                    >
                                        Random
                                    </Button>
                                }
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <h4 className='h4 mt-3'>Promote List</h4>
            <Table
                dataSource={promoteList}
                columns={[
                    { title: 'Promote Name', dataIndex: 'name', key: 'name' },
                    { title: 'Description', dataIndex: 'description', key: 'description' },
                    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
                    { title: 'Type', dataIndex: 'type', key: 'type' },
                    { title: 'Start At', dataIndex: 'startAt', key: 'startAt', render: (startAt: string) => moment(startAt).format('YYYY-MM-DD HH:mm:ss') },
                    { title: 'End At', dataIndex: 'endAt', key: 'endAt', render: (endAt: string) => moment(endAt).format('YYYY-MM-DD HH:mm:ss') },
                    {
                        title: 'Actions', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button onClick={() => onOpenCreatePromoteModal(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Are you sure you want to delete this promote?"
                                    onConfirm={() => onDeletePromote(record.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />

            <h4 className='h4 mt-3'>Coupon List</h4>
            <Table
                dataSource={couponList}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Promote Name', dataIndex: 'promote', key: 'promote', render: (promote) => promote?.name || 'N/A' },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag> },
                    { title: 'Coupon Code', dataIndex: 'code', key: 'code' },
                    {
                        title: 'Actions', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button onClick={() => onOpenCreateCouponModal(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Are you sure you want to delete this coupon?"
                                    onConfirm={() => onDeleteCoupon(record.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />
        </div>
    );
};

export default AdminPromote;
