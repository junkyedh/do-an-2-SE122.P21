import { Button, Form, message, Modal, Popconfirm, Space, Table } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './ManagerStaffList.scss';
import SearchInput from '@/components/Search/SearchInput';
import { AdminApiRequest } from '@/services/AdminApiRequest';
import FloatingLabelInput from '@/components/FloatingInput/FloatingLabelInput';

const ManagerStaffList = () => {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [form] = Form.useForm();

    const branchId = Number(localStorage.getItem('branchId')) || null;

    const fetchStaffList = async () => {
        try {
            const res = await AdminApiRequest.get('/branch-staff/list');
            setStaffList(res.data);
        } catch (error) {
            message.error('Không thể tải danh sách nhân viên.');
        }
    };

    useEffect(() => {
        fetchStaffList();
    }, []);

    const exportExcel = () => {
        const data = staffList.map((s) => ({
            ID: s.id,
            'Tên nhân viên': s.name,
            'Giới tính': s.gender,
            'Ngày sinh': moment(s.birth).format('DD-MM-YYYY'),
            'SĐT': s.phone,
            'Loại nhân viên': s.typeStaff,
            'Địa chỉ': s.address,
            'Giờ làm việc': s.workHours,
            'Lương': s.salary,
            'Lương tối thiểu': s.minsalary,
            'Ngày bắt đầu': moment(s.startDate).format('DD-MM-YYYY HH:mm:ss'),
            'Trạng thái': s.activeStatus ? 'Hoạt động' : 'Ngưng',
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'NhanVien');
        XLSX.writeFile(wb, 'DanhSachNhanVien.xlsx');
    };

    const handleSearchKeyword = () => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) return fetchStaffList();
        const filtered = staffList.filter((s) =>
            [s.name, s.phone, s.typeStaff].some((val) =>
                (val || '').toLowerCase().includes(keyword),
            )
        );
        setStaffList(filtered);
    };

    const openFormModal = (record: any = null) => {
        setEditingStaff(record);
        form.setFieldsValue({
            ...record,
            birth: record?.birth ? moment(record.birth) : null,
            startDate: record?.startDate ? moment(record.startDate) : null,
        });
        setOpenModal(true);
    };

    const submitForm = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                ...values,
                birth: moment(values.birth).format('YYYY-MM-DD'),
                startDate: moment(values.startDate).format('YYYY-MM-DD HH:mm:ss'),
                branchId: editingStaff?.branchId ?? branchId,
            };

            if (editingStaff) {
                await AdminApiRequest.put(`/branch-staff/${editingStaff.id}`, {
                    ...data,
                    role: values.role || 'STAFF',
                });
                message.success('Cập nhật thành công.');
            } else {
                await AdminApiRequest.post('/branch-staff', {
                    ...data,
                    password: 'staff123',
                    activeStatus: true,
                    salary: Number(values.salary),
                    minsalary: Number(values.salary),
                    role: 'STAFF',
                });
                message.success('Tạo mới thành công.');
            }

            setOpenModal(false);
            setEditingStaff(null);
            form.resetFields();
            fetchStaffList();
        } catch (error) {
            message.error('Đã có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    const onDeleteStaff = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/branch-staff/${id}`);
            message.success('Xóa thành công.');
            fetchStaffList();
        } catch {
            message.error('Lỗi khi xóa.');
        }
    };

    return (
        <div className="container-fluid m-2">
            <div className="sticky-header-wrapper">
                <h2 className="h2 header-custom">DANH SÁCH NHÂN VIÊN</h2>
                <div className="header-actions d-flex justify-content-between align-items-center py-2 me-2">
                    <Form layout="inline" className="search-form d-flex">
                        <SearchInput
                            placeholder="Tìm theo tên, loại, SĐT"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onSearch={handleSearchKeyword}
                            allowClear
                        />
                    </Form>
                    <div>
                        <Button
                            type="primary"
                            icon={<i className="fas fa-plus"></i>}
                            onClick={() => openFormModal()}
                        >
                        </Button>
                        <Button icon={<DownloadOutlined />} onClick={exportExcel} />
                    </div>
                </div>
            </div>

            <Modal
                title={editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
                open={openModal}
                onCancel={() => {
                    setOpenModal(false);
                    setEditingStaff(null);
                    form.resetFields();
                }}
                onOk={submitForm}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <div className="grid-2">
                        <FloatingLabelInput name="name" label="Tên nhân viên" rules={[{ required: true }]} component="input" />
                        <FloatingLabelInput name="gender" label="Giới tính" rules={[{ required: true }]} component="select" options={[
                            { value: 'Nam', label: 'Nam' },
                            { value: 'Nữ', label: 'Nữ' },
                            { value: 'Khác', label: 'Khác' },
                        ]} />
                    </div>
                    <div className="grid-2">
                        <FloatingLabelInput name="birth" label="Ngày sinh" component="date" rules={[{ required: true }]} />
                        <FloatingLabelInput name="phone" label="Số điện thoại" component="input" rules={[{ required: true }]} />
                    </div>
                    <div className="grid-2">
                        <FloatingLabelInput name="address" label="Địa chỉ" component="input" rules={[{ required: true }]} />
                        <FloatingLabelInput name="typeStaff" label="Loại nhân viên" component="input" rules={[{ required: true }]} />
                    </div>
                    <div className="grid-2">
                        <FloatingLabelInput name="salary" label="Lương (VND)" component="input" type="number" rules={[{ required: true }]} />
                        <FloatingLabelInput name="workHours" label="Giờ làm việc" component="input" type="number" rules={[{ required: true }]} />
                    </div>
                    <FloatingLabelInput name="startDate" label="Ngày bắt đầu" component="date" rules={[{ required: true }]} />
                </Form>
            </Modal>

            <Table
                dataSource={staffList}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên', dataIndex: 'name', key: 'name' },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
                    { title: 'Loại NV', dataIndex: 'typeStaff', key: 'typeStaff' },
                    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
                    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
                    { title: 'Giờ làm', dataIndex: 'workHours', key: 'workHours', render: (val: number) => `${val} giờ` },
                    {
                        title: 'Lương', dataIndex: 'salary', key: 'salary', render: (val: number) =>
                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
                    },
                    {
                        title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', render: (val: string) =>
                            moment(val).format('DD-MM-YYYY'),
                    },
                    {
                        title: 'Hành động',
                        key: 'action',
                        render: (_, record) => (
                            <Space>
                                <Button icon={<i className="fas fa-edit" />} onClick={() => openFormModal(record)} />
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa?"
                                    onConfirm={() => onDeleteStaff(record.id)}
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

export default ManagerStaffList;
