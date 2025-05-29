import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import moment from 'moment';
import "./CustomerList.scss";
import { MainApiRequest } from '@/services/MainApiRequest';

const CustomerList = () => {
    const [form] = Form.useForm();
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [openCreateCustomerModal, setOpenCreateCustomerModal] = useState(false);
    const [membershipList, setMembershipList] = useState<any[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
    const [editingMembership, setEditingMembership] = useState<any | null>(null);
    const [openCreateMembershipModal, setOpenCreateMembershipModal] = useState(false);
    
    const fetchCustomerList = async () => {
        try {
            const res = await MainApiRequest.get('/customer/list');
            setCustomerList(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng:', error);
            message.error('Không thể lấy danh sách khách hàng. Vui lòng thử lại.');
        }
    };

    const fetchMembershipList = async () => {
        try {
            const res = await MainApiRequest.get('/membership/list');
            setMembershipList(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách membership:', error);
            message.error('Không thể lấy danh sách membership. Vui lòng thử lại.');
        }
    }

    useEffect(() => {
        fetchCustomerList();
        fetchMembershipList();
    }, []);

    const onOpenCreateCustomerModal = (record: any = null) => {
        setEditingCustomer(null);
        if (record){
            setEditingCustomer(record);
            form.setFieldsValue({
                ...record,
                registrationDate: moment(record.registrationDate),
            });
        }
        setOpenCreateCustomerModal(true);
    };

    const onOpenCreateMembershipModal = (record: any = null) => {
        setEditingMembership(null);
        if (record){
            setEditingMembership(record);
            form.setFieldsValue({
                ...record,
            });
        }
        setOpenCreateMembershipModal(true);
    };

    const onOKCreateCustomer = async () => {
        try {
            const data = form.getFieldsValue();
            data.registrationDate = data.registrationDate.toISOString();

            if (editingCustomer) {
                const { id, ...rest } = data;
                await MainApiRequest.put(`/customer/${editingCustomer.id}`, rest);
            } else {
                await MainApiRequest.post('/customer', data);
            }

            fetchCustomerList();
            setOpenCreateCustomerModal(false);
            form.resetFields();
            setEditingCustomer(null);
        } catch (error) {
            console.error('Lỗi khi tạo khách hàng:', error);
            message.error('Không thể tạo khách hàng. Vui lòng thử lại.');
        }
    };

    const onOkCreateMembership = async () => {
        try {
            const data = form.getFieldsValue();
            if (editingMembership) {
                const { password, ...rest } = data;
                await MainApiRequest.put(`/membership/${editingMembership.id}`, rest);
            } else {
                await MainApiRequest.post('/membership', data);
            }

            fetchMembershipList();
            setOpenCreateMembershipModal(false);
            form.resetFields();
            setEditingMembership(null);
        } catch (error) {
            console.error('Lỗi khi tạo membership:', error);
            message.error('Không thể tạo membership. Vui lòng thử lại.');   
        }
    };

    const onCancelCreateCustomer = () => {
        setOpenCreateCustomerModal(false);
        form.resetFields();
    };

    const onCancelCreateMembership = () => {
        setOpenCreateMembershipModal(false);
        form.resetFields();
    };

    const onEditCustomer = (record:any) => {
        setEditingCustomer(record);
        form.setFieldsValue({
            ...record,
            registrationDate: moment(record.registrationDate),
        });
        setOpenCreateCustomerModal(true);
    };

    const onEditMembership = (record:any) => {
        setEditingMembership(record);
        form.setFieldsValue({
            ...record,  
        });
        setOpenCreateMembershipModal(true);
    }

    const onDeleteCustomer = async (id: number) => {
        try {
            await MainApiRequest.delete(`/customer/${id}`);
            fetchCustomerList();
            message.success('Xóa khách hàng thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa khách hàng:', error);
            message.error('Không thể xóa khách hàng. Vui lòng thử lại.');
        }
    };

    const onDeleteMembership = async (id: number) => {
        try {
            await MainApiRequest.delete(`/membership/${id}`);
            fetchMembershipList();
            message.success('Xóa membership thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa membership:', error);
            message.error('Không thể xóa membership. Vui lòng thử lại.');
        }
    }

    return (
        <div className="container-fluid m-2">
            <h2 className='h2 header-custom'>DANH SÁCH KHÁCH HÀNG</h2>
            <Button 
                type='primary' 
                onClick={() => onOpenCreateCustomerModal()}
            >
                Thêm mới khách hàng
            </Button>

            <Modal
                className='customer-modal'
                title={editingCustomer ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateCustomerModal}
                onOk={() => onOKCreateCustomer()}
                onCancel={() => onCancelCreateCustomer()}
            >
                <Form form={form} layout="vertical">
                    <div className="field-row">
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                        >
                            <Select>
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                                <Select.Option value="Khác">Khác</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                        label="Ngày đăng ký"
                        name="registrationDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày đăng ký!" }]}
                    >
                        <DatePicker showTime/>
                    </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Tổng mức chi tiêu"
                            name="total"
                        >
                            <Input type="number"  disabled/>
                        </Form.Item>
                        <Form.Item
                            label="Hạng thành viên"
                            name="rank"
                        >
                            <Select  disabled>
                                {membershipList.map((membership) => (
                                    <Select.Option key={membership.id} value={membership.rank}>
                                        {membership.rank}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <h4 className='h4 mt-3'>Danh sách khách hàng</h4>
            <Table
                dataSource={customerList}
                pagination={{
                    pageSize: 5, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên', dataIndex: 'name', key: 'name' },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    { title: 'Tổng chi tiêu', dataIndex: 'total', key: 'total',
                       
                        render: (total: number) => total ? new Intl.NumberFormat('vi-VN',
                             { style: 'currency', currency: 'VND' }).format(total).replace('₫', 'đ') : '0đ'
                     },
                    { title: 'Hạng thành viên', dataIndex: 'rank', key: 'rank',
                        render: (rank: string) => (rank ? rank : 'Thường'),
                     },
                    { title: 'Ngày đăng ký', dataIndex: 'registrationDate', key: 'registrationDate',
                        render: (registrationDate: string) => (registrationDate ? moment(registrationDate).format('DD-MM-YYYY HH:mm:ss') : '-')
                     },
                    {
                        title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onEditCustomer(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa khách hàng này không?"
                                    onConfirm={() => onDeleteCustomer(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />

            <Button
                type='primary'
                className='mt-4'
                onClick={() => onOpenCreateMembershipModal()}
            >
                Thêm Membership
            </Button>
            
            <Modal
                className='customer-modal'
                title={editingMembership ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateMembershipModal}
                onOk={() => onOkCreateMembership()}
                onCancel={() => onCancelCreateMembership()}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Hạng thành viên"
                        name="rank"
                        rules={[{ required: true, message: "Vui lòng nhập hạng thành viên!" }]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <div className="field-row">
                        <Form.Item
                            label="Hạn mức chi tiêu"
                            name="mprice"
                            rules={[{ required: true, message: "Vui lòng nhập hạn mức chi tiêu!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Hạn mức giảm giá"
                            name="discount"
                            rules={[{ required: true, message: "Vui lòng nhập hạn mức giảm giá!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <h4 className='h4 mt-3'>Membership</h4>
            <Table
                dataSource={membershipList}
                pagination={{
                    pageSize: 5, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Hạng thành viên', dataIndex: 'rank', key: 'rank' },
                    { title: 'Hạn mức chi tiêu', dataIndex: 'mprice', key: 'mprice',
                        render: (mprice: number) => mprice ? new Intl.NumberFormat('vi-VN',
                             { style: 'currency', currency: 'VND' }).format(mprice).replace('₫', 'đ') : '0đ'
                     },
 
                        
                    { title: 'Hạng mức giảm giá', dataIndex: 'discount', key: 'discount',
                        render: (discount: number) => discount ? new Intl.NumberFormat('vi-VN',
                            { style: 'currency', currency: 'VND' }).format(discount).replace('₫', 'đ') : '0đ'
                        },
                    {
                        title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onEditMembership(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa membership này không?"
                                    onConfirm={() => onDeleteMembership(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button danger>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default CustomerList;