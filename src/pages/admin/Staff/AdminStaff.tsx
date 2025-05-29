import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import "./AdminStaff.scss";
import { MainApiRequest } from '@/services/MainApiRequest';

const AdminStaff = () => {
    const [form] = Form.useForm();
    const [staffList, setStaffList] = useState<any[]>([]);

    const [openCreateStaffModal, setOpenCreateStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any | null>(null);

    const fetchStaffList = async () => {
        const res = await MainApiRequest.get('/staff/list');
        setStaffList(res.data);
    };

    useEffect(() => {
        fetchStaffList();
    }, []);

    const onOpenCreateStaffModal = () => {
        setOpenCreateStaffModal(true);
    };

    const onOKCreateStaff = async () => {
        setOpenCreateStaffModal(false);
        const data = form.getFieldsValue();
        if (editingStaff) {
            const {
                password,
                ...rest
            } = data;
            await MainApiRequest.put(`/staff/${editingStaff.id}`, rest);
        } else {
            await MainApiRequest.post('/staff', data);
        }
        fetchStaffList();
        setEditingStaff(null);
        form.resetFields();
    }


    const onCancelCreateStaff = () => {
        setOpenCreateStaffModal(false);
        setEditingStaff(null);
        form.resetFields();
    };

    const onEditStaff = (staff: any) => {
        setEditingStaff(staff);
        form.setFieldsValue(staff);
        setOpenCreateStaffModal(true);
    };

    const onDeleteStaff = async (id: number) => {
        await MainApiRequest.delete(`/staff/${id}`);
        fetchStaffList();
    };

    return (
        <div className="container-fluid m-2">
            <h3 className='h3'>Staff Management</h3>
            <Button
                type='primary'
                onClick={() => onOpenCreateStaffModal()}
            >
                Create Staff
            </Button>

            <Modal
                className='staff-modal'
                title={editingStaff ? "Edit Staff" : "Create Staff"}
                open={openCreateStaffModal}
                onOk={onOKCreateStaff}
                onCancel={onCancelCreateStaff}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ role: "ROLE_ADMIN" }} // Đặt giá trị mặc định cho "role"
                >
                    <div className="field-row">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: "Please input name!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name="role"
                        >
                            <Select>
                                <Select.Option value="ROLE_ADMIN">Manager</Select.Option>
                                <Select.Option value="ROLE_RECEP">Receptionist</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please input email!" }]}
                        >
                            <Input type="email" />
                        </Form.Item>
                        {!editingStaff &&
                            <Form.Item
                                label="Password"
                                name="password"

                                rules={[{ required: true, message: "Please input password!" }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        }
                    </div>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: "Please input phone number!" }]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Please input address!" }]}
                    >
                        <Input type="text" />
                    </Form.Item>

                </Form>
            </Modal>

            <Table
                dataSource={staffList}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Email', dataIndex: 'email', key: 'email' },
                    { title: 'Address', dataIndex: 'address', key: 'address' },
                    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
                    { title: 'Role', dataIndex: 'role', key: 'role', render: (role: string) => role === 'ROLE_ADMIN' ? 'Manager' : 'Receptionist' },
                    {
                        title: 'Action',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button onClick={() => onEditStaff(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Are you sure to delete this staff?"
                                    onConfirm={() => onDeleteStaff(record.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button onClick={() => onDeleteStaff(record.id)} danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space >
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default AdminStaff;
