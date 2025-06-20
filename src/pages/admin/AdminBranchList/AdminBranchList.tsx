import { Button, Form, Input, message, Modal, Popconfirm, Space, Table, Tag, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import "./AdminBranchList.scss";
import { AdminApiRequest } from '@/services/AdminApiRequest';
import FloatingLabelInput from '@/components/adminsytem/FloatingInput/FloatingLabelInput';
import SearchInput from '@/components/adminsytem/Search/SearchInput';

const AdminBranchList = () => {
    const [branchForm] = Form.useForm();
    const [adminBranchList, setAdminBranchList] = useState<any[]>([]);
    const [openCreateBranchModal, setOpenCreateBranchModal] = useState(false);
    const [editBranch, setEditBranch] = useState<any>(null);
    const [managerList, setManagerList] = useState<any[]>([]);
    const [createManagerModalOpen, setCreateManagerModalOpen] = useState(false);
    const [managerForm] = Form.useForm();

    const fetchAdminBranchList = async () => {
        try {
            const res = await AdminApiRequest.get('/branch/list');
            setAdminBranchList(res.data);
        } catch (error) {
            console.error('Error fetching branch list:', error);
            message.error('Failed to fetch branch list.');
        }

    }

    useEffect(() => {
        fetchAdminBranchList();
    }, []);

    // Các hàm xử lý cho Branch
    const onOpenCreateBranchModal = (record: any = null) => {
        setEditBranch(record);
        if (record) {
            branchForm.setFieldsValue({
                ...record,
                createAt: moment(record.createAt),
            });
        } else {
            branchForm.resetFields();
        }
        setOpenCreateBranchModal(true);
    }

    const onOKCreateBranch = async () => {
        try {
            const data = branchForm.getFieldsValue();
            if (data.createAt) {
                data.createAt = data.createAt.toISOString();
            } else {
                message.error("Create date is required!");
                return;
            }

            if (editBranch) {
                const { id, ...rest } = data;
                await AdminApiRequest.put(`/branch/${editBranch.id}`, rest);
            } else {
                await AdminApiRequest.post('/branch', data);
                // Gán branchId cho staff
                const createdBranch = await AdminApiRequest.get('/branch/list'); // hoặc trả từ API khi tạo
                const newBranchId = createdBranch?.data?.[createdBranch.data.length - 1]?.id;

                await AdminApiRequest.put(`/staff/staffbranch/${data.managerId}`, {
                    branchId: newBranchId,
                });
            }

            console.log("Branch data:", data);
            fetchAdminBranchList();
            setOpenCreateBranchModal(false);
            branchForm.resetFields();
            message.success("Branch saved successfully!");
            setEditBranch(null);
        } catch (error) {
            console.error('Error saving branch:', error);
            message.error('Failed to save branch. Please try again.');
        }
    }

    const onCancelCreateBranch = () => {
        setOpenCreateBranchModal(false);
        branchForm.resetFields();
    }

    const onOpenEditBranch = (record: any) => {
        setEditBranch(record);
        branchForm.setFieldsValue({
            ...record,
            createAt: moment(record.createAt),
            managerId: record.manager?.id || null,
        });
        setOpenCreateBranchModal(true);
    };

    const onDeleteBranch = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/branch/${id}`);
            fetchAdminBranchList();
            message.success('Branch deleted successfully!');
        } catch (error) {
            console.error('Error deleting branch:', error);
            message.error('Failed to delete branch. Please try again.');
        }
    }


    // Hàm tìm kiếm theo từ khóa
    const [searchKeyword, setSearchKeyword] = useState('');
    const handleSearchKeyword = () => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) {
            fetchAdminBranchList();
            return;
        }
        const filtered = adminBranchList.filter(branch => {
            const name = (branch.name || '').toLowerCase();
            const address = (branch.address || '').toLowerCase();
            return name.includes(keyword) || address.includes(keyword);
        });
        setAdminBranchList(filtered);
    };
    // Reset search when keyword is empty
    useEffect(() => {
        if (!searchKeyword.trim()) {
            fetchAdminBranchList();
        }
    }, [searchKeyword]);

    const fetchManagerList = async () => {
        try {
            const res = await AdminApiRequest.get('/staff/list?role=ADMIN_BRAND');
            setManagerList(res.data);
        } catch (error) {
            console.error('Error fetching manager list:', error);
            message.error('Không thể lấy danh sách quản lý.');
        }
    };
    useEffect(() => {
        fetchManagerList();
    }, []);

    return (
        <div className="container-fluid m-2">
            <div className='sticky-header-wrapper'>
                <h2 className="h2 header-custom">QUẢN LÝ CHI NHÁNH</h2>
                <div className="header-actions d-flex me-3 py-2 align-items-center justify-content-between">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        <Form layout="inline" className="search-form d-flex">
                            <SearchInput
                                placeholder="Tìm kiếm theo id, tên chi nhánh hoặc địa chỉ"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onSearch={handleSearchKeyword}
                                allowClear
                            />
                        </Form>
                    </div>
                    <div className="d-flex">
                        <Button
                            type="primary"
                            icon={<i className="fas fa-plus"></i>}
                            onClick={() => onOpenCreateBranchModal()}
                        >
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal for creating or editing branch */}
            <Modal
                className="custom-modal branch-modal"
                title={editBranch ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateBranchModal}
                onCancel={onCancelCreateBranch}
                footer={null}
            >
                <Form form={branchForm} layout="vertical">
                    <FloatingLabelInput
                        name="name"
                        label="Tên chi nhánh"
                        component='input'
                        rules={[{ required: true, message: 'Tên chi nhánh là bắt buộc' }]}
                    />
                    <FloatingLabelInput
                        name='address'
                        label='Địa chỉ'
                        component='input'
                        type='textarea'
                        rules={[{ required: true, message: 'Địa chỉ là bắt buộc' }]}
                    />
                    <FloatingLabelInput
                        name="phone"
                        label='Số điện thoại'
                        component='input'
                        type='number'
                        rules={[{ required: true, message: 'Số điện thoại là bắt buộc' }]}
                    />
                    <FloatingLabelInput
                        name="createAt"
                        label="Ngày tạo"
                        component='date'
                        rules={[{ required: true, message: 'Ngày tạo là bắt buộc' }]}
                    />
                    <FloatingLabelInput
                        name="managerId"
                        label="Người quản lý"
                        component="select"
                        rules={[{ required: true, message: 'Vui lòng chọn người quản lý' }]}
                        options={managerList.map((manager) => ({
                            label: `${manager.name} - ${manager.phone}`,
                            value: manager.id,
                        }))}
                        componentProps={{
                            showSearch: true,
                            allowClear: true,
                            optionFilterProp: 'children',
                            filterOption: (input: string, option: any) =>
                                option.label.toLowerCase().includes(input.toLowerCase()),
                        }}
                    />
                    <div className="d-flex justify-content-end mb-2">
                        <Button type="link" onClick={() => setCreateManagerModalOpen(true)}>
                            + Tạo mới quản lý
                        </Button>
                    </div>

                    <div className='modal-footer-custom d-flex justify-content-end align-items-center gap-3'>
                        <Button
                            type='default'
                            onClick={onCancelCreateBranch}
                        >
                            Hủy
                        </Button>
                        <Button
                            type='primary'
                            onClick={onOKCreateBranch}
                        >
                            {editBranch ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                open={createManagerModalOpen}
                title="Tạo mới người quản lý"
                onCancel={() => {
                    setCreateManagerModalOpen(false);
                    managerForm.resetFields();
                }}
                footer={null}
            >
                <Form form={managerForm} layout="vertical">
                    <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                        <Select options={[{ value: 'MALE', label: 'Nam' }, { value: 'FEMALE', label: 'Nữ' }]} />
                    </Form.Item>
                    <Form.Item name="birth" label="Ngày sinh" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="salary" label="Lương" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="typeStaff" label="Loại nhân viên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="minsalary" label="Lương tối thiểu" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <div className="d-flex justify-content-end gap-2">
                        <Button onClick={() => setCreateManagerModalOpen(false)}>Hủy</Button>
                        <Button type="primary" onClick={async () => {
                            try {
                                const values = managerForm.getFieldsValue();
                                const payload = {
                                    ...values,
                                    startDate: new Date().toISOString(),
                                    activeStatus: true,
                                    role: 'ADMIN_BRAND',
                                    branchId: null,
                                };
                                const res = await AdminApiRequest.post('/staff', payload);
                                message.success('Tạo mới người quản lý thành công!');
                                setCreateManagerModalOpen(false);
                                managerForm.resetFields();

                                // Cập nhật vào danh sách + gán vào branchForm
                                fetchManagerList();
                                branchForm.setFieldValue('managerId', res.data.id);
                            } catch (error) {
                                console.error(error);
                                message.error('Tạo mới quản lý thất bại.');
                            }
                        }}>Tạo</Button>
                    </div>
                </Form>
            </Modal>

            <Table
                dataSource={adminBranchList}
                pagination={{
                    pageSize: 8, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                    // Các tùy chọn cho số item mỗi trang
                }
                }

                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
                    { title: 'Tên chi nhánh', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
                    {
                        title: 'Ngày tạo',
                        dataIndex: 'createAt',
                        render: (value: string) =>
                            moment(value).format('YYYY-MM-DD HH:mm:ss'),
                    },
                    {
                        title: 'Người quản lý',
                        dataIndex: 'manager',
                        key: 'manager',
                        render: (manager: any) => manager?.name || '---',
                    },
                    {
                        title: 'Actions', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onOpenEditBranch(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa chi nhánh này?"
                                    onConfirm={() => onDeleteBranch(record.id)}
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

        </div>
    );
};

export default AdminBranchList;