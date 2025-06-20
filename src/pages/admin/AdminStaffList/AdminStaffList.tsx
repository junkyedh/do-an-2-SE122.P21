import { Button, Form, Input, message, Table, Upload, Space, Popconfirm, Modal, Select, DatePicker, InputNumber, Row, Col } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import "./AdminStaffList.scss";
import SearchInput from '@/components/adminsytem/Search/SearchInput';
import { AdminApiRequest } from '@/services/AdminApiRequest';

const AdminStaffList = () => {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [staffForm] = Form.useForm();
    const [branchList, setBranchList] = useState<any[]>([]);

    const fetchStaffList = async () => {
        try {
            const res = await AdminApiRequest.get('/staff/list');
            const staffWithBranch = res.data.map((staff: any) => ({
                ...staff,
                branch: branchList.find((b: any) => b.id === staff.branchId) || null
            }));
            setStaffList(staffWithBranch);
        } catch (error) {
            console.error('Error fetching staff list:', error);
            message.error('Failed to fetch staff list.');
        }
    };

    const fetchBranchList = async () => {
        try {
            const res = await AdminApiRequest.get('/branch/list');
            setBranchList(res.data);
        } catch (error) {
            console.error('Error fetching branch list:', error);
        }
    };

    useEffect(() => {
        fetchStaffList();
        fetchBranchList();
    }, []);

    const handleSearchKeyword = () => {
        if (!searchKeyword.trim()) {
            fetchStaffList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
            return;
        }
        const keyword = searchKeyword.toLowerCase();
        const filtered = staffList.filter(staff =>
            staff.name.toLowerCase().includes(keyword) ||
            staff.typeStaff.toLowerCase().includes(keyword) ||
            staff.phone.toLowerCase().includes(keyword)
        );
        setStaffList(filtered);
    }

    const handleImportExcel = (file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log("Imported Excel data:", jsonData);
            message.success("Import thành công (chỉ hiển thị, không lưu vào hệ thống).");
            // Có thể thêm logic hiển thị hoặc xử lý khác nếu cần
        };
        reader.readAsArrayBuffer(file);
        return false; // Ngăn AntD upload mặc định
    };

    const exportExcel = () => {
        const exportData = staffList.map((staff) => ({
            'ID': staff.id,
            'Tên nhân viên': staff.name,
            'Giới tính': staff.gender,
            'Ngày sinh': moment(staff.birth).format('DD-MM-YYYY'),
            'Số điện thoại': staff.phone,
            'Loại nhân viên': staff.typeStaff,
            'Địa chỉ': staff.address,
            'Giờ làm việc': staff.workHours,
            'Lương': staff.salary,
            'Ngày bắt đầu': moment(staff.startDate).format('DD-MM-YYYY HH:mm:ss'),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachNhanVien");
        XLSX.writeFile(workbook, "DanhSachNhanVien.xlsx");
    };

    const onOpenStaffModal = (record: any = null) => {
        setEditingStaff(record);
        if (record) {
            staffForm.setFieldsValue({
                ...record,
                birth: moment(record.birth),
                startDate: moment(record.startDate),
            });
        } else {
            staffForm.resetFields();
        }
        setOpenModal(true);
    };

    const onSubmitStaff = async () => {
        try {
            const values = staffForm.getFieldsValue();
            values.birth = values.birth.toISOString();
            values.startDate = values.startDate.toISOString();
            values.role = 'ADMIN_SYSTEM'; // cố định role

            if (editingStaff) {
                await AdminApiRequest.put(`/staff/${editingStaff.id}`, values);
                message.success('Cập nhật nhân viên thành công!');
            } else {
                await AdminApiRequest.post('/staff', values);
                message.success('Thêm nhân viên thành công!');
            }

            setOpenModal(false);
            staffForm.resetFields();
            fetchStaffList();
        } catch (error) {
            console.error(error);
            message.error('Lưu nhân viên thất bại!');
        }
    };

    const onDeleteStaff = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/staff/${id}`);
            fetchStaffList();
            message.success('Staff deleted successfully!');
        } catch (error) {
            console.error('Error deleting staff:', error);
            message.error('Failed to delete staff. Please try again.');
        }
    }

    return (
        <div className="container-fluid m-2">
            <div className='sticky-header-wrapper'>
                <h2 className="h2 header-custom">DANH SÁCH NHÂN VIÊN</h2>
                {/* Tìm kiếm và Import + Export */}
                <div className="header-actions d-flex me-2 py-2 align-items-center justify-content-between">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        <Form layout="inline" className="search-form d-flex">
                            <SearchInput
                                placeholder="Tìm kiếm theo tên, loại nhân viên hoặc SĐT"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onSearch={handleSearchKeyword}
                                allowClear
                            />
                        </Form>
                    </div>
                    <div className="d-flex" >
                        <Upload
                            beforeUpload={handleImportExcel}
                            showUploadList={false}
                            accept=".xlsx, .xls"
                        >
                            <Button
                                type="default" icon={<UploadOutlined />}
                                title='Tải lên file Excel'
                            />
                        </Upload>
                        <Button
                            type="default" icon={<DownloadOutlined />}
                            onClick={exportExcel}
                            title='Tải xuống danh sách'
                        />
                        <Button
                            type="primary"
                            icon={<i className="fas fa-plus"></i>}
                            onClick={() => onOpenStaffModal()}
                        >
                        </Button>
                    </div>
                </div>
            </div>

            <Table
                dataSource={staffList}
                rowKey="id"
                rowClassName={(_, index) => index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
                    { title: 'Tên nhân viên', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', sorter: (a, b) => a.gender.localeCompare(b.gender) },
                    {
                        title: 'Ngày sinh',
                        dataIndex: 'birth',
                        key: 'birth',
                        sorter: (a, b) => moment(a.birth).unix() - moment(b.birth).unix(),
                        render: (birth: string) =>
                            birth ? moment(birth).format('DD-MM-YYYY') : '-',
                    },
                    { title: 'Loại nhân viên', dataIndex: 'typeStaff', key: 'typeStaff', sorter: (a, b) => a.typeStaff.localeCompare(b.typeStaff) },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    {
                        title: 'Chi nhánh làm việc',
                        dataIndex: 'branch',
                        key: 'branch',
                        render: (branch: any) => branch?.name || '---',
                    },
                    {
                        title: 'Giờ làm việc',
                        dataIndex: 'workHours',
                        key: 'workHours',
                        sorter: (a, b) => a.workHours - b.workHours,
                        render: (value: number) => `${value} giờ`,
                    },
                    {
                        title: 'Lương',
                        dataIndex: 'salary',
                        key: 'salary',
                        sorter: (a, b) => a.salary - b.salary,
                        render: (value: number) =>
                            new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(value),
                    },
                    {
                        title: 'Ngày bắt đầu',
                        dataIndex: 'startDate',
                        key: 'startDate',
                        sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
                        render: (value: string) =>
                            value ? moment(value).format('DD-MM-YYYY HH:mm:ss') : '-',
                    },
                    {
                        title: 'Actions', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onOpenStaffModal(record)}>
                                    <i className="fas fa-edit" />
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa nhân viên này?"
                                    onConfirm={() => onDeleteStaff(record.id)}
                                    okText="Đồng ý"
                                    cancelText="Hủy"

                                >
                                    <Button className='ant-btn-danger'>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />

            <Modal
                open={openModal}
                title={editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm mới nhân viên'}
                onCancel={() => {
                    setOpenModal(false);
                    staffForm.resetFields();
                }}
                footer={null}
            >
                <Form form={staffForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                                <Select options={[{ label: 'Nam', value: 'MALE' }, { label: 'Nữ', value: 'FEMALE' }]} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="birth" label="Ngày sinh" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="typeStaff" label="Loại nhân viên" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="role" label="Phân quyền" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { label: 'ADMIN_SYSTEM', value: 'ADMIN_SYSTEM' },
                                        { label: 'ADMIN_BRAND', value: 'ADMIN_BRAND' },
                                        { label: 'STAFF', value: 'STAFF' },
                                    ]}
                                    onChange={(value) => {
                                        if (value === 'ADMIN_SYSTEM') {
                                            staffForm.setFieldValue('branchId', null);
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="salary" label="Lương">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="minsalary" label="Lương tối thiểu">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="branchId"
                                label="Chi nhánh"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (getFieldValue('role') === 'ADMIN_SYSTEM') return Promise.resolve();
                                            if (!value) return Promise.reject('Vui lòng chọn chi nhánh');
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <Select
                                    placeholder="Chọn chi nhánh"
                                    allowClear
                                    options={branchList.map(branch => ({
                                        label: branch.name,
                                        value: branch.id,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="modal-footer-custom d-flex justify-content-end align-items-center gap-3">
                        <Button onClick={() => setOpenModal(false)}>Hủy</Button>
                        <Button type="primary" onClick={onSubmitStaff}>
                            {editingStaff ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminStaffList;
