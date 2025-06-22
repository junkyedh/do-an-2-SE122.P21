import { Button, Form, message, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { AdminApiRequest } from '@/services/AdminApiRequest';
import FloatingLabelInput from '@/components/adminsytem/FloatingInput/FloatingLabelInput';
import './ManagerTable.scss';

const ManagerTableList = () => {
    const [tableList, setTableList] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingTable, setEditingTable] = useState<any>(null);
    const [form] = Form.useForm();

    const branchId = Number(localStorage.getItem('branchId')) || null;

    const fetchTableList = async () => {
        try {
            const res = await AdminApiRequest.get('/table/list');
            setTableList(res.data);
        } catch (error) {
            message.error('Không thể tải danh sách bàn.');
        }
    };

    useEffect(() => {
        fetchTableList();
    }, []);

    const openFormModal = (record: any = null) => {
        setEditingTable(record);
        form.setFieldsValue({
            ...record,
        });
        setOpenModal(true);
    };

    const submitForm = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                ...values,
                branchId: editingTable?.branchId ?? branchId,
                phoneOrder: null,
                name: null,
                bookingTime: null,
                seatingTime: null,
            };

            if (editingTable) {
                await AdminApiRequest.put(`/table/${editingTable.id}`, data);
                message.success('Cập nhật thành công.');
            } else {
                await AdminApiRequest.post('/table', data);
                message.success('Tạo mới thành công.');
            }

            setOpenModal(false);
            setEditingTable(null);
            form.resetFields();
            fetchTableList();
        } catch (error) {
            message.error('Đã có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const onDeleteTable = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/table/${id}`);
            message.success('Xóa thành công.');
            fetchTableList();
        } catch {
            message.error('Lỗi khi xóa.');
        }
    };

    const onCancelCreateTable = () => {
        setOpenModal(false);
        form.resetFields();
    };

    return (
        <div className="container-fluid m-2">
            <div className="sticky-header-wrapper">
                <h2 className="h2 header-custom">DANH SÁCH BÀN</h2>
                <div className="header-actions py-2 me-2 text-end">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => openFormModal()}
                    >
                    </Button>
                </div>
            </div>

            <Modal
                className="custom-modal promote-modal"
                title={editingTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
                open={openModal}
                onCancel={() => onCancelCreateTable()}
                onOk={submitForm}
                footer={null}
                // okText="Lưu"
                // cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <FloatingLabelInput
                        name="status"
                        label="Trạng thái"
                        component="select"
                        options={[
                            { value: 'Available', label: 'Available' },
                            { value: 'Occupied', label: 'Occupied' },
                        ]}
                        rules={[{ required: true }]}
                    />
                    <FloatingLabelInput
                        name="seat"
                        label="Số ghế"
                        component="input"
                        type="number"
                        rules={[{ required: true, min: 1 }]}
                    />
                    <div className='modal-footer-custom d-flex justify-content-end align-items-center gap-3'>
                        <Button
                            type='default'
                            onClick={onCancelCreateTable}
                        >
                            Hủy
                        </Button>
                        <Button
                            type='primary'
                            onClick={submitForm}
                        >
                            {editingTable ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Table
                dataSource={tableList}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status: string) => {
                            let color = 'default';
                            if (status === 'Available') color = 'green';
                            else if (status === 'Occupied') color = 'volcano';

                            return <Tag color={color}>{status}</Tag>;
                        }
                    },
                    { title: 'Số ghế', dataIndex: 'seat', key: 'seat' },
                    /*{
                        title: 'Tên khách hàng',
                        dataIndex: 'name',
                        key: 'name',
                        render: (val: string | null) => val || '—',
                    },*/
                    {
                        title: 'SĐT khách',
                        dataIndex: 'phoneOrder',
                        key: 'phoneOrder',
                        render: (val: string | null) => val || '—',
                    },
                    {
                        title: 'Giờ đặt',
                        dataIndex: 'bookingTime',
                        key: 'bookingTime',
                        render: (val: string | null) =>
                            val ? moment(val).format('HH:mm DD-MM-YYYY') : '—',
                    },
                    {
                        title: 'Giờ ngồi',
                        dataIndex: 'seatingTime',
                        key: 'seatingTime',
                        render: (val: string | null) =>
                            val ? moment(val).format('HH:mm DD-MM-YYYY') : '—',
                    },
                    {
                        title: 'Hành động',
                        key: 'action',
                        render: (_, record) => (
                            <Space>
                                <Button icon={<i className="fas fa-edit" />} onClick={() => openFormModal(record)} />
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa?"
                                    onConfirm={() => onDeleteTable(record.id)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                >
                                    <Button danger icon={<i className="fas fa-trash" />} />
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />
        </div>
    );
};

export default ManagerTableList;
